/**
 * Database Initialization Script
 * Verifies the DATABASE_URL connection and prints the setup checklist.
 * Run this after configuring your Postgres database.
 */

import { db } from "../src/db";
import { user } from "../src/db/schema";

async function initializeDatabase() {
  console.log("🚀 Initializing database...");

  try {
    // Test database connection
    console.log("📡 Testing database connection...");
    const result = await db.select().from(user).limit(1);
    console.log(
      `✅ Database connection successful (${result.length} user rows checked)!`
    );

    console.log("\n📋 Database Setup Checklist:");
    console.log("1. ✅ Database connection working");
    console.log("2. ⏳ Apply the schema — pick one:");
    console.log("   - npx drizzle-kit push          (fast, dev-friendly)");
    console.log("   - psql $DATABASE_URL -f migrations/001_initial_schema.sql");
    console.log("   - then the remaining migrations/00*.sql files in order");
    console.log("3. ⏳ Verify tables (npm run db:studio)");
    console.log("4. ⏳ Start the app and test sign-up → verification → dashboard");
    console.log("\n✨ Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

initializeDatabase();
