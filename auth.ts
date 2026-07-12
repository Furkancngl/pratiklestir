import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { checkRateLimit, getClientIp, loginRateLimit } from "@/app/lib/rate-limit";

class RateLimitedSignin extends CredentialsSignin {
  code = "rate_limited";
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, request) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const ip = getClientIp(request.headers);
        const { allowed } = await checkRateLimit(loginRateLimit, `login:${ip}`);
        if (!allowed) {
          throw new RateLimitedSignin();
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase()))
          .limit(1);

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          password,
          user.passwordHash
        );
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          planSelected: user.planSelectedAt !== null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.plan = user.plan;
        token.name = user.name;
        token.planSelected = user.planSelected;
      }
      if (trigger === "update" && session?.name !== undefined) {
        token.name = session.name;
      }
      if (trigger === "update" && session?.plan !== undefined) {
        token.plan = session.plan;
      }
      if (trigger === "update" && session?.planSelected !== undefined) {
        token.planSelected = session.planSelected;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.plan = token.plan as string;
        session.user.name = token.name as string | null | undefined;
        session.user.planSelected = (token.planSelected as boolean) ?? false;
      }
      return session;
    },
  },
});
