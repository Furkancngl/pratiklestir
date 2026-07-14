import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  name: text("name"),
  plan: text("plan").notNull().default("free"),
  planSelectedAt: timestamp("plan_selected_at", { withTimezone: true }),
  credits: integer("credits").notNull().default(30),
  creditsResetAt: timestamp("credits_reset_at", { withTimezone: true }),
  // Hesap güvenlik uyarıları burada yok: her zaman açık ve kapatılamaz
  // olduğu için ayrı bir alan tutmaya gerek yok (bkz. ayarlar/bildirimler).
  notifyNewFeatures: boolean("notify_new_features").notNull().default(true),
  notifyMarketing: boolean("notify_marketing").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
