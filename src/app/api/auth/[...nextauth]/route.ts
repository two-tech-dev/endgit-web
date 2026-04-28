import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: any = {
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          // Send to API to exchange and create user
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/github`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              access_token: account.access_token,
              token_type: account.token_type || "bearer",
              scope: account.scope || ""
            }),
          });
          const data = await response.json();
          if (data.success) {
            user.id = data.data.user.id;
            (user as any).username = data.data.user.username;
            (user as any).trustLevel = data.data.user.trustLevel;
            (user as any).apiToken = data.data.token;
            return true;
          }
        } catch (error) {
          console.error("Auth error", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.trustLevel = (user as any).trustLevel;
        token.apiToken = (user as any).apiToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).trustLevel = token.trustLevel;
        (session.user as any).apiToken = token.apiToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
