import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

// Better Auth owns /api/auth/*: sign-in, sign-up, verification callbacks,
// password reset, magic link, social OAuth, and session management.
export const { GET, POST } = toNextJsHandler(auth);

export const runtime = "nodejs";
