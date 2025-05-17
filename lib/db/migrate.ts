import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // ✅ Load this first!

import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("Database url is not set in .env.local");
}

async function runMigrate() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ All migrations are successfully done");
  } catch (error) {
    console.log("❌ Migrations are not done successfully");
    console.log(error);
    process.exit(1);
  }
}

runMigrate();
