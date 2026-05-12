import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      username?: string;
      trustLevel?: string;
      apiToken?: string;
    };
  }

  interface User {
    id?: string;
    username?: string;
    trustLevel?: string;
    apiToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    trustLevel?: string;
    apiToken?: string;
    refreshToken?: string;
    apiTokenExpiresAt?: number;
  }
}
