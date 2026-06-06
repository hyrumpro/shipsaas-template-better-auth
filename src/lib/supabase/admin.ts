/**
 * Supabase Admin Client
 * Uses service role key to bypass Row Level Security (RLS)
 *
 * SECURITY WARNING:
 * This client bypasses all RLS policies. Only use server-side.
 * Never expose service role key to the client.
 *
 * Use cases:
 * - Admin operations (delete users, manage subscriptions)
 * - Background jobs (cleanup, migrations)
 * - Webhook handlers (system operations)
 * - Data imports/exports
 *
 * The client is lazy-initialised so the production build does not require
 * Supabase env vars to be set (matches the pattern in src/utils/stripe.ts
 * and src/db/index.ts).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!supabaseServiceRoleKey && process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable in production"
    );
  }

  _supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRoleKey || "dummy-key-for-development",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  return _supabaseAdmin;
}

type AdminAuthClient = SupabaseClient["auth"]["admin"];

const adminAuthProxy = new Proxy(
  {} as AdminAuthClient,
  {
    get(_target, prop) {
      const client = getSupabaseAdmin();
      const admin = client.auth.admin;
      const value = Reflect.get(admin, prop, admin);
      return typeof value === "function" ? value.bind(admin) : value;
    },
  }
) as AdminAuthClient;

const adminDbProxy = new Proxy(
  {} as Pick<SupabaseClient, "from" | "auth">,
  {
    get(_target, prop) {
      const client = getSupabaseAdmin();
      const value = Reflect.get(client, prop, client);
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
) as SupabaseClient;

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as SupabaseClient;

export const adminAuth = {
  async deleteUser(userId: string) {
    const { error } = await adminAuthProxy.deleteUser(userId);
    if (error) throw error;
    return true;
  },

  async getUserById(userId: string) {
    const { data, error } = await adminAuthProxy.getUserById(userId);
    if (error) throw error;
    return data.user;
  },

  async listUsers(page: number = 1, perPage: number = 50) {
    const { data, error } = await adminAuthProxy.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    return data;
  },

  async updateUserMetadata(userId: string, metadata: Record<string, any>) {
    const { error } = await adminAuthProxy.updateUserById(userId, {
      user_metadata: metadata,
    });
    if (error) throw error;
    return true;
  },

  async banUser(userId: string) {
    const { error } = await adminAuthProxy.updateUserById(userId, {
      ban_duration: "none",
    });
    if (error) throw error;
    return true;
  },
};

export const adminDb = {
  async getUser(userId: string) {
    const { data, error } = await adminDbProxy
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: Record<string, any>) {
    const { data, error } = await adminDbProxy
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getActiveSubscriptions() {
    const { data, error } = await adminDbProxy
      .from("subscriptions")
      .select("*, users(*)")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getStats() {
    const { count: totalUsers } = await adminDbProxy
      .from("users")
      .select("*", { count: "exact", head: true });
    const { count: activeSubscriptions } = await adminDbProxy
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    const { count: totalOrders } = await adminDbProxy
      .from("orders")
      .select("*", { count: "exact", head: true });
    return {
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalOrders: totalOrders || 0,
    };
  },
};

export default supabaseAdmin;
