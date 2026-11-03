import { Pool } from "pg";
import { env } from "../config/env";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export const db = drizzle(pool);