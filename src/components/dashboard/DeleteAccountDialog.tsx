"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

const CONFIRMATION_PHRASE = "delete my account";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const confirmed = text.trim().toLowerCase() === CONFIRMATION_PHRASE;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setText("");
      setError(null);
      setLoading(false);
    }
    setOpen(next);
  }

  async function onDelete() {
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      router.push("/?deleted=1");
      router.refresh();
    } catch (err) {
      logger.error("Account deletion failed", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete account"
      );
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Delete your account?</DialogTitle>
          <DialogDescription className="text-center">
            This is permanent. Your profile, sessions, and access to active
            subscriptions will be removed immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label htmlFor="confirm" className="text-sm">
            Type{" "}
            <span className="font-mono font-semibold text-foreground">
              {CONFIRMATION_PHRASE}
            </span>{" "}
            to confirm.
          </Label>
          <Input
            id="confirm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={CONFIRMATION_PHRASE}
            autoComplete="off"
            spellCheck={false}
            className="font-mono"
            aria-invalid={text.length > 0 && !confirmed}
          />
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={!confirmed || loading}
            className="gap-2"
          >
            {loading ? (
              "Deleting…"
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete forever
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
