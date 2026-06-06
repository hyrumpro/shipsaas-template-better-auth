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
import { createUser, updateUser, getUserById } from "@/db/queries";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/error-handler";
import { sendWelcomeEmail } from "@/lib/mailgun";
import { trackEventServer } from "@/lib/observability";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Verify webhook signature
    const signature =
      req.headers.get("x-supabase-signature") ||
      req.headers.get("x-webhook-signature");
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction && !webhookSecret) {
      logger.error(
        "SUPABASE_WEBHOOK_SECRET is not configured in production; refusing webhook"
      );
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (webhookSecret) {
      if (!signature) {
        logger.warn("Supabase auth webhook missing signature header");
        return NextResponse.json(
          { error: "Missing signature" },
          { status: 401 }
        );
      }

      const hmac = crypto.createHmac("sha256", webhookSecret);
      const digest = hmac.update(rawBody).digest("hex");

      // Accept Supabase v1,<hex> format or plain hex
      const provided = signature.includes(",")
        ? (signature.split(",").pop() ?? "").trim()
        : signature.trim();

      const providedBuf = Buffer.from(provided, "hex");
      const digestBuf = Buffer.from(digest, "hex");

      if (
        providedBuf.length !== digestBuf.length ||
        !crypto.timingSafeEqual(providedBuf, digestBuf)
      ) {
        logger.warn("Supabase auth webhook signature verification failed");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const { type, record } = payload;

    if (
      !type ||
      !record ||
      typeof record.id !== "string" ||
      typeof record.email !== "string"
    ) {
      logger.warn("Supabase auth webhook missing required fields", { type });
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    logger.info("Supabase auth webhook received", { type, userId: record.id });

    switch (type) {
      case "INSERT":
        // User created (sign up)
        await handleUserCreated(record);
        break;

      case "UPDATE":
        // User updated (profile changes, email verification, etc.)
        await handleUserUpdated(record);
        break;

      case "DELETE":
        // User deleted
        await handleUserDeleted(record);
        break;

      default:
        logger.info("Unhandled auth webhook event type", { type });
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
    const fullName =
      record.raw_user_meta_data?.full_name ||
      record.raw_user_meta_data?.name ||
      record.raw_user_meta_data?.display_name ||
      null;

    const avatarUrl =
      record.raw_user_meta_data?.avatar_url ||
      record.raw_user_meta_data?.picture ||
      null;

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
    void trackEventServer("user_signed_up", { userId, hasFullName: !!fullName });

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
    const fullName =
      record.raw_user_meta_data?.full_name ||
      record.raw_user_meta_data?.name ||
      record.raw_user_meta_data?.display_name ||
      existingUser.fullName;

    const avatarUrl =
      record.raw_user_meta_data?.avatar_url ||
      record.raw_user_meta_data?.picture ||
      existingUser.avatarUrl;

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
