/**
 * Database Initialization Script
 * Run this after setting up Supabase to create initial data
 */

import { db } from "../src/db";
import { users } from "../src/db/schema";
import { createClient } from "@supabase/supabase-js";

async function initializeDatabase() {
  console.log("🚀 Initializing database...");

  try {
    // Test database connection
    console.log("📡 Testing database connection...");
    const result = await db.select().from(users).limit(1);
    console.log("✅ Database connection successful!");

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        "⚠️  Supabase credentials not found. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
      return;
    }

    console.log("✅ Supabase credentials configured");

    // Test Supabase connection
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: authData, error: authError } = await supabase.auth.getSession();

    if (authError) {
      console.warn("⚠️  Supabase auth check failed:", authError.message);
    } else {
      console.log("✅ Supabase connection successful!");
    }

    console.log("\n📋 Database Setup Checklist:");
    console.log("1. ✅ Database connection working");
    console.log("2. ⏳ Run migrations in Supabase dashboard:");
    console.log("   - supabase/migrations/001_initial_schema.sql");
    console.log("   - supabase/migrations/002_row_level_security.sql");
    console.log("3. ⏳ Verify tables in Supabase Table Editor");
    console.log("4. ⏳ Test RLS policies");
    console.log("\n✨ Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };
