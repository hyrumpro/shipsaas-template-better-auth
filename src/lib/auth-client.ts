"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

/**
 * Better Auth browser client. Mirrors src/lib/auth.ts — any server plugin
 * used there needs its client counterpart listed here (currently magicLink).
 */
export const authClient = createAuthClient({
  plugins: [magicLinkClient()],
});

export type AuthClientSession = typeof authClient.$Infer.Session;
