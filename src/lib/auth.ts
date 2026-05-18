import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

interface EndGitAuthResponse {
  success: boolean;
  data?: {
    token?: string;
    refreshToken?: string;
    access_token?: string;
    refresh_token?: string;
    user?: {
      id?: string;
      username?: string;
      trustLevel?: string;
    };
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email repo admin:repo_hook",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/github`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_token: account.access_token,
                token_type: account.token_type || "bearer",
                scope: account.scope || "",
              }),
            },
          );
          const data = (await response.json()) as EndGitAuthResponse;
          if (data.success && data.data?.user) {
            user.id = data.data.user.id;
            user.username = data.data.user.username;
            user.trustLevel = data.data.user.trustLevel;
            user.apiToken = data.data.token;
            user.refreshToken = data.data.refreshToken;
            return true;
          }
        } catch (error) {
          console.error("Auth error", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.trustLevel = user.trustLevel;
        token.apiToken = user.apiToken;
        token.refreshToken = user.refreshToken;
        token.apiTokenExpiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
      }

      if (
        token.refreshToken &&
        typeof token.apiTokenExpiresAt === "number" &&
        Date.now() / 1000 > token.apiTokenExpiresAt - 3600
      ) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                refresh_token: token.refreshToken,
              }),
            },
          );
          const data = (await res.json()) as EndGitAuthResponse;
          if (data.success && data.data) {
            token.apiToken = data.data.access_token;
            token.refreshToken = data.data.refresh_token;
            token.apiTokenExpiresAt =
              Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
          }
        } catch {
          // Keep the old token; the session will fail once it hard-expires.
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.trustLevel = token.trustLevel;
        session.user.apiToken = token.apiToken;
      }
      return session;
    },
  },
};
