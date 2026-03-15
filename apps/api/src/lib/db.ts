import * as schema from "@clawmarket/db";
import { drizzle } from "drizzle-orm/d1";

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;
