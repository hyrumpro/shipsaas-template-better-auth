/**
 * Supabase Auth Webhook
 * Syncs authenticated users to the database and sends welcome emails
 *
 * Setup Instructions:
 * 1. Go to Supabase Dashboard > Authentication > Hooks
 * 2. Enable "Send webhook on user events"
 * 3. Set the URL to: https://yourdomain.com/api/auth/webhook
 * 4. Add a secret and set it in SUPABASE_WEBHOOK_SECRET env variable
 * 5. Select events: user.created, user.updated, user.deleted
 */

import { NextResponse } from "next/server";
import {
  claimWebhookEvent,
  createUser,
  updateUser,
  getUserById,
  markWebhookEventFailed,
  markWebhookEventProcessed,
} from "@/db/queries";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/error-handler";
import { sendWelcomeEmail } from "@/lib/mailgun";
import { trackEventServer } from "@/lib/observability";
import {
  createWebhookBodyDedupeKey,
  verifyHmacSha256,
} from "@/lib/webhook-security";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    // Verify webhook signature
    const signature =
      req.headers.get("x-supabase-signature") ||
      req.headers.get("x-webhook-signature");
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error(
        "SUPABASE_WEBHOOK_SECRET is not configured; refusing webhook"
      );
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const providedSignature = signature?.includes(",")
      ? (signature.split(",").pop()?.trim() ?? null)
      : signature;

    if (!verifyHmacSha256(rawBody, providedSignature ?? null, webhookSecret)) {
      logger.warn("Supabase auth webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse only after the signature has been verified.
    const payload = JSON.parse(rawBody);
    const record = payload.record ?? payload.user;
    const type =
      payload.type ?? payload.event ?? (payload.user ? "UPSERT" : "");
    const userId = record?.id;
    const eventId =
      req.headers.get("x-supabase-event-id") ??
      payload.event_id ??
      createWebhookBodyDedupeKey("supabase", rawBody);

    if (
      !type ||
      !record ||
      typeof record.id !== "string" ||
      (type !== "DELETE" &&
        type !== "user.deleted" &&
        typeof record.email !== "string")
    ) {
      logger.warn("Supabase auth webhook missing required fields", { type });
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const claimed = await claimWebhookEvent({
      provider: "supabase",
      eventId,
      eventType: String(type),
      payload,
    });

    if (!claimed) {
      logger.info("Supabase auth webhook already processed, skipping", {
        eventId,
        type,
      });
      return NextResponse.json({ success: true });
    }

    logger.info("Supabase auth webhook received", { type, userId });

    try {
      switch (type) {
        case "INSERT":
        case "user.created":
          // User created (sign up)
          await handleUserCreated(record);
          break;

        case "UPDATE":
        case "UPSERT":
        case "user.updated":
          // User updated (profile changes, email verification, etc.)
          await handleUserUpdated(record);
          break;

        case "DELETE":
        case "user.deleted":
          // User deleted
          await handleUserDeleted(record);
          break;

        default:
          logger.info("Unhandled auth webhook event type", { type });
      }

      await markWebhookEventProcessed(eventId);
    } catch (error) {
      await markWebhookEventFailed(
        eventId,
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Auth webhook processing error", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}

async function handleUserCreated(record: any) {
  try {
    const userId = record.id;
    const email = record.email;

    // Check if user already exists (to handle race conditions)
    const existingUser = await getUserById(userId);

    if (existingUser) {
      logger.info("User already exists in database", { userId });
      return;
    }

    // Extract user metadata from OAuth or email signup
    const metadata = record.raw_user_meta_data ?? record.user_metadata ?? {};
    const fullName =
      metadata.full_name || metadata.name || metadata.display_name || null;

    const avatarUrl = metadata.avatar_url || metadata.picture || null;

    // Create user in database
    await createUser({
      id: userId,
      email: email,
      fullName: fullName,
      avatarUrl: avatarUrl,
    });

    logger.auth("user_created", userId, true);
    logger.info("User synced to database", {
      userId,
      email,
      hasFullName: !!fullName,
      hasAvatar: !!avatarUrl,
    });
    void trackEventServer("user_signed_up", {
      userId,
      hasFullName: !!fullName,
    });

    // Send welcome email
    const name = fullName || email.split("@")[0];

    try {
      await sendWelcomeEmail(email, name);
      logger.info("Welcome email sent", { userId, email });
    } catch (emailError) {
      // Don't fail the entire operation if email fails
      logger.error("Failed to send welcome email", emailError, { userId });
    }
  } catch (error) {
    logger.error("Failed to create user in database", error, {
      userId: record?.id,
    });
    throw error;
  }
}

async function handleUserUpdated(record: any) {
  try {
    const userId = record.id;

    // Check if user exists
    const existingUser = await getUserById(userId);

    if (!existingUser) {
      // If user doesn't exist, create them (handle edge case)
      logger.info("User not found, creating from update event", { userId });
      await handleUserCreated(record);
      return;
    }

    // Extract updated metadata
    const metadata = record.raw_user_meta_data ?? record.user_metadata ?? {};
    const fullName =
      metadata.full_name ||
      metadata.name ||
      metadata.display_name ||
      existingUser.fullName;

    const avatarUrl =
      metadata.avatar_url || metadata.picture || existingUser.avatarUrl;

    // Update user in database
    await updateUser(userId, {
      fullName: fullName,
      avatarUrl: avatarUrl,
    });

    logger.info("User updated in database", { userId });
  } catch (error) {
    logger.error("Failed to update user in database", error, {
      userId: record?.id,
    });
    throw error;
  }
}

async function handleUserDeleted(record: any) {
  try {
    const userId = record.id;

    // Note: The user is automatically deleted via cascade delete
    // in the database schema (users table has onDelete: cascade)

    logger.info("User deleted from auth, database cascade delete triggered", {
      userId,
    });
  } catch (error) {
    logger.error("Failed to handle user deletion", error, {
      userId: record?.id,
    });
    throw error;
  }
}
