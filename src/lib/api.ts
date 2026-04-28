import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Helper function to fetch data from the backend API.
 * Automatically injects the user's API token if available.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Use absolute URL if starting with http, otherwise prepend the API base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  // Get the session to extract the API token
  // Note: This relies on next-auth's getServerSession, so it must be called in a Server Component
  // In a real app with next-auth app dir, you'd pass authOptions here
  // For simplicity, we'll try to get it, and if it fails, we proceed without auth.
  let token = null;
  try {
    const session = await getServerSession(authOptions) as any;
    if (session && session.user && session.user.apiToken) {
      token = session.user.apiToken;
    }
  } catch (error) {
    // Silently ignore session errors (might be called from somewhere without next-auth context)
  }

  const headers = new Headers(options.headers || {});
  
  // Set default Content-Type to JSON if not uploading a file (FormData)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Inject Authorization token
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    cache: "no-store", // Fix Next.js aggressive caching for authenticated requests
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Return parsed JSON and the raw response
  const data = await response.json().catch(() => null);

  return { response, data };
}
