import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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

        if (!user || !user.passwordHash) return null;

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
    async jwt({ token, user, account, trigger, session }) {
      if (account?.provider === "google" && user?.email) {
        const email = user.email.toLowerCase();
        const googleId = account.providerAccountId;
        let [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!dbUser) {
          [dbUser] = await db
            .insert(users)
            .values({ email, name: user.name ?? null, googleId })
            .returning();
        } else if (!dbUser.googleId) {
          [dbUser] = await db
            .update(users)
            .set({ googleId })
            .where(eq(users.id, dbUser.id))
            .returning();
        }

        token.plan = dbUser.plan;
        token.name = dbUser.name;
        token.planSelected = dbUser.planSelectedAt !== null;
        return token;
      }

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
