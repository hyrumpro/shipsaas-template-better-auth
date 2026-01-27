"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";

export function useAuth() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        logger.error("Failed to get user", error);
        throw error;
      }

      return user;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (updates: { data: Record<string, any> }) => {
      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) {
        logger.error("Failed to update profile", error);
        throw error;
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
  const supabase = createClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.error("Failed to sign out", error);
        throw error;
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
