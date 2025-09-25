import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = (profile as any)?.email?.toString().toLowerCase() ?? "";
      const verified = (profile as any)?.email_verified === true;

      // Allow only verified @psych-nyc.com accounts
      if (!verified) return false;
      if (!email.endsWith("@psych-nyc.com")) return false;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = (user as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string | undefined;
        session.user.email = token.email as string | undefined;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
