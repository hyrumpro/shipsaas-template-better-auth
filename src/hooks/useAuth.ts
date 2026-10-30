"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";

/**
 * Client-side session hook. Returns the Better Auth user (or null) and is
 * backed by TanStack Query, so `useAuth()` keeps the same consumer shape
 * as before: `const { data: user, isLoading } = useAuth()`.
 *
 * For server-side checks use `getServerSession()` from "@/lib/auth".
 */
export function useAuth(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();

      // 401 simply means "not signed in" — not an error worth logging.
      if (error) {
        if (error.status === 401) return null;
        logger.error("Failed to get session", error);
        throw error;
      }

      return data?.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { name?: string; image?: string | null }) => {
      const { data, error } = await authClient.updateUser(updates);

      if (error) {
        logger.error("Failed to update profile", error);
        throw new Error(error.message || "Failed to update profile");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      logger.info("Profile updated successfully");
    },
    onError: (error) => {
      logger.error("Profile update failed", error);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error("Failed to sign out", error);
        throw new Error(error.message || "Failed to sign out");
      }
    },
    onSuccess: () => {
      queryClient.clear();
      logger.info("User signed out successfully");
    },
    onError: (error) => {
      logger.error("Sign out failed", error);
    },
  });
}
