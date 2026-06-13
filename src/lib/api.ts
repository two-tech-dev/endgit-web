import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Helper function to fetch data from the backend API.
 * Automatically injects the user's API token if available.
 */
interface FetchApiOptions extends RequestInit {
  revalidate?: number;
  noAuth?: boolean;
}

export async function fetchApi(
  endpoint: string,
  options: FetchApiOptions = {},
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  let token = null;
  if (!options.noAuth) {
    try {
      const session = (await getServerSession(authOptions)) as any;
      if (session && session.user && session.user.apiToken) {
        token = session.user.apiToken;
      }
    } catch (error) {}
  }

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const { revalidate, noAuth, ...fetchOptions } = options;

  const nextOptions: RequestInit["next"] = revalidate
    ? { revalidate }
    : undefined;

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    ...(nextOptions ? { next: nextOptions } : { cache: "no-store" }),
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  return { response, data };
}

/**
 * Helper function to execute GraphQL queries/mutations.
 */
export async function fetchGraphQL(
  query: string,
  variables: Record<string, any> = {},
  options: FetchApiOptions = {}
) {
  const { response, data } = await fetchApi("/api/graphql", {
    ...options,
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });

  if (data?.errors) {
    console.error("GraphQL Errors:", data.errors);
    throw new Error(data.errors[0]?.message || "GraphQL Error");
  }

  return { response, data: data?.data };
}

