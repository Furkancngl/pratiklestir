import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    plan: string;
    planSelected: boolean;
  }

  interface Session {
    user: {
      plan: string;
      planSelected: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: string;
    planSelected?: boolean;
  }
}
