import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cached: Db | undefined;

// DATABASE_URL genellikle sadece runtime'da mevcut (Vercel/Neon env'i).
// Bağlantıyı modül yüklenirken değil, ilk sorguda kurarak build/import
// aşamasının DATABASE_URL yokken çökmesini önlüyoruz.
function getDb(): Db {
  if (!cached) {
    const sql = neon(process.env.DATABASE_URL!);
    cached = drizzle(sql, { schema });
  }
  return cached;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
