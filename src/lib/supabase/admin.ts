/**
 * Supabase Admin Client
 * Uses service role key to bypass Row Level Security (RLS)
 *
 * ⚠️ SECURITY WARNING:
 * This client bypasses all RLS policies. Only use server-side.
 * Never expose service role key to the client.
 *
 * Use cases:
 * - Admin operations (delete users, manage subscriptions)
 * - Background jobs (cleanup, migrations)
 * - Webhook handlers (system operations)
 * - Data imports/exports
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate configuration
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceRoleKey && process.env.NODE_ENV === 'production') {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable in production');
}

/**
 * Admin client with service role permissions
 * Bypasses Row Level Security (RLS)
 *
 * @example
 * // Delete a user (admin only)
 * await supabaseAdmin.auth.admin.deleteUser(userId);
 *
 * @example
 * // Query without RLS
 * const { data } = await supabaseAdmin
 *   .from('users')
 *   .select('*')
 *   .eq('email', 'user@example.com');
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || 'dummy-key-for-development',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Admin Auth Operations
 * Convenience functions for common admin tasks
 */
export const adminAuth = {
  /**
   * Delete a user from Supabase Auth
   * Also triggers cascade delete in your database
   */
  async deleteUser(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return true;
  },

  /**
   * Get user by ID (bypasses RLS)
   */
  async getUserById(userId: string) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (error) throw error;
    return data.user;
  },

  /**
   * List all users (paginated)
   */
  async listUsers(page: number = 1, perPage: number = 50) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Update user metadata
   */
  async updateUserMetadata(userId: string, metadata: Record<string, any>) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: metadata,
    });
    if (error) throw error;
    return true;
  },

  /**
   * Ban a user (soft delete)
   */
  async banUser(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: 'none', // Permanent ban
    });
    if (error) throw error;
    return true;
  },
};

/**
 * Admin Database Operations
 * Direct database access bypassing RLS
 */
export const adminDb = {
  /**
   * Get any user from database (bypasses RLS)
   */
  async getUser(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update any user (bypasses RLS)
   */
  async updateUser(userId: string, updates: Record<string, any>) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all active subscriptions
   */
  async getActiveSubscriptions() {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*, users(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Admin analytics
   */
  async getStats() {
    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active subscriptions
    const { count: activeSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get recent orders
    const { count: totalOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true });

    return {
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalOrders: totalOrders || 0,
    };
  },
};

// Export the admin client as default
export default supabaseAdmin;
