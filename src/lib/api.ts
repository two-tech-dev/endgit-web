import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Helper function to fetch data from the backend API.
 * Automatically injects the user's API token if available.
 */
interface FetchApiOptions extends RequestInit {
  revalidate?: number;
}

export async function fetchApi(endpoint: string, options: FetchApiOptions = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  let token = null;
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (session && session.user && session.user.apiToken) {
      token = session.user.apiToken;
    }
  } catch (error) {}

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const { revalidate, ...fetchOptions } = options;

  const nextOptions: RequestInit["next"] = revalidate
    ? { revalidate }
    : undefined;

  const config: RequestInit = {
    cache: revalidate ? "force-cache" : "no-store",
    ...fetchOptions,
    headers,
    ...(nextOptions ? { next: nextOptions } : {}),
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  return { response, data };
}
