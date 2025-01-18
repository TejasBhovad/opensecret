import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  "postgresql://neondb_owner:tELKfG4zdQ2A@ep-morning-waterfall-a8tco43v.eastus2.azure.neon.tech/neondb?sslmode=require",
);
export const db = drizzle(sql, { schema });
