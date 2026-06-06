"use client";

import * as React from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";

export function ProfileForm({
  defaultName,
  email,
}: {
  defaultName: string;
  email: string;
}) {
  const [name, setName] = React.useState(defaultName);
  const updateProfile = useUpdateProfile();
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      await updateProfile.mutateAsync({
        data: { full_name: name },
      });
      setSaved(true);
    } catch (err) {
      logger.error("Profile update failed", err);
      setError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          disabled
          readOnly
          className="bg-muted/30"
        />
        <p className="text-xs text-muted-foreground">
          Email is managed by your auth provider. Contact support to change it.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={updateProfile.isPending || name === defaultName}
          className="gap-2"
        >
          {updateProfile.isPending ? (
            "Saving…"
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
        {saved && (
          <p
            role="status"
            className="text-sm text-emerald-500 animate-in fade-in slide-in-from-left-2"
          >
            Saved.
          </p>
        )}
      </div>
    </form>
  );
}
