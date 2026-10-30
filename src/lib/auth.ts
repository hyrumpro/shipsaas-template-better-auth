/**
 * Better Auth server instance.
 *
 * Single source of truth for authentication. The `user` table in
 * src/db/schema.ts IS the Better Auth user table — app fields
 * (isSubscribed, stripeCustomerId, …) are declared below as
 * `additionalFields` with `input: false` so they can only be written
 * by server code (webhooks, admin), never by an auth API call.
 *
 * The db client and Mailgun client are lazy, so importing this module
 * does not require DATABASE_URL / MAILGUN_* at build time.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { headers } from "next/headers";

import { randomBytes } from "node:crypto";

import { db } from "@/db";
import { isShowcaseMode } from "@/lib/env-validation";
import * as schema from "@/db/schema";
import {
  sendEmailVerification,
  sendMagicLinkEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "@/lib/mailgun";
import { logger } from "@/lib/logger";
import { trackEventServer } from "@/lib/observability";

const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const displayName = (email: string, name?: string | null) =>
  name?.trim() || email.split("@")[0];

export const auth = betterAuth({
  // Better Auth refuses to construct without a secret. In showcase mode
  // (frontend-only demo, no environment configured) use an ephemeral
  // per-process one so pages render; real deployments must set
  // BETTER_AUTH_SECRET.
  secret:
    process.env.BETTER_AUTH_SECRET ??
    (isShowcaseMode() ? randomBytes(32).toString("hex") : undefined),
  appName: process.env.NEXT_PUBLIC_APP_NAME || "ShipSaaS",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    // Users must click the verification link before they can sign in.
    // After verifying, they are signed in automatically.
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(
        user.email,
        displayName(user.email, user.name),
        url,
        user.id
      );
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerification(
        user.email,
        displayName(user.email, user.name),
        url,
        user.id
      );
    },
  },

  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : {},

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, displayName(email), url);
      },
    }),
    // Needed so auth cookies set from server actions / route handlers
    // are forwarded to the browser response.
    nextCookies(),
  ],

  user: {
    additionalFields: {
      isSubscribed: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
      subscriptionTier: {
        type: "string",
        input: false,
        required: false,
      },
      stripeCustomerId: {
        type: "string",
        input: false,
        required: false,
      },
      lemonSqueezyCustomerId: {
        type: "string",
        input: false,
        required: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh expiry once a day
    // Sessions newer than this count as "fresh" — gate sensitive actions
    // (change password, delete account) on a recent sign-in.
    freshAge: 60 * 60,
    // Cache the session in a cookie for 5 minutes so most RSC requests
    // don't hit the database just to read the session. "compact" is a
    // Base64url + HMAC signed payload — small and tamper-proof.
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "compact",
    },
  },

  // Better Auth ships its own rate limiting on auth endpoints. Defaults:
  // 100 req / 10s per IP overall, with sensitive endpoints already capped
  // at 3 req / 10s. The custom rules below tighten the credential
  // endpoints further against brute force.
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/request-password-reset": { window: 60, max: 3 },
      "/forget-password": { window: 60, max: 3 },
    },
  },

  // Google OAuth tokens are stored in the `account` table for signed-in
  // users. Encrypt them at rest (AES-256-GCM) instead of plaintext.
  account: {
    encryptOAuthTokens: true,
  },

  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          // Lightweight security audit trail: log every new sign-in.
          logger.auth("session_created", session.userId, true);
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          try {
            const name = displayName(user.email, user.name);
            await sendWelcomeEmail(user.email, name);
            void trackEventServer("user_signed_up", {
              userId: user.id,
              hasFullName: Boolean(user.name?.trim()),
            });
          } catch (error) {
            // Never fail signup because the welcome email failed.
            logger.error("Failed to send welcome email", error, {
              userId: user.id,
            });
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];

/**
 * Read the session inside server components, layouts, and route handlers.
 * Returns null when there is no valid session.
 */
export async function getServerSession(): Promise<Session | null> {
  return auth.api.getSession({ headers: await headers() });
}
