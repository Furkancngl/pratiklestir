import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  plan: text("plan").notNull().default("free"),
  planSelectedAt: timestamp("plan_selected_at", { withTimezone: true }),
  credits: integer("credits").notNull().default(30),
  creditsResetAt: timestamp("credits_reset_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
