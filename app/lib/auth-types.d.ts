import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    plan: string;
  }

  interface Session {
    user: {
      plan: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: string;
  }
}
