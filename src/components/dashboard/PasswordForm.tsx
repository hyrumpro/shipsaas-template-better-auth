"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";

type FormState = "idle" | "saving" | "saved" | "error";

export function PasswordForm() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [state, setState] = React.useState<FormState>("idle");
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (state !== "saved") return;
    const t = setTimeout(() => {
      setState("idle");
      setMessage(null);
    }, 3000);
    return () => clearTimeout(t);
  }, [state]);

  const tooShort = next.length > 0 && next.length < 8;
  const mismatched = confirm.length > 0 && next !== confirm;
  const disabled =
    state === "saving" ||
    !current ||
    next.length < 8 ||
    next !== confirm;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setMessage(null);

    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      // Signing out other devices after a password change is good hygiene.
      revokeOtherSessions: true,
    });

    if (error) {
      setState("error");
      setMessage(
        /password/i.test(error.message ?? "") &&
        /invalid|incorrect/i.test(error.message ?? "")
          ? "Current password is incorrect."
          : error.message || "Failed to update password."
      );
      logger.error("Password update failed", error);
      return;
    }

    setState("saved");
    setMessage("Password updated.");
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="current">Current password</Label>
        <div className="relative">
          <Input
            id="current"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            minLength={8}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={show ? "Hide passwords" : "Show passwords"}
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="next">New password</Label>
        <Input
          id="next"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={8}
          aria-invalid={tooShort}
        />
        {tooShort && (
          <p className="text-xs text-destructive">
            Password must be at least 8 characters.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm new password</Label>
        <Input
          id="confirm"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          aria-invalid={mismatched}
        />
        {mismatched && (
          <p className="text-xs text-destructive">Passwords do not match.</p>
        )}
      </div>

      {message && (
        <p
          role={state === "error" ? "alert" : "status"}
          className={
            state === "error"
              ? "rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              : "rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400"
          }
        >
          {message}
        </p>
      )}

      <Button type="submit" disabled={disabled} className="gap-2">
        {state === "saving" ? (
          "Updating…"
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Update password
          </>
        )}
      </Button>
    </form>
  );
}
