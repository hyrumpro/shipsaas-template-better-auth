import * as React from "react";

import { getServerSession } from "@/lib/auth";
import { getUserByEmail } from "@/db/queries";
import { PageHeader, Section } from "@/components/dashboard/PageHeader";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordForm } from "@/components/dashboard/PasswordForm";
import { formatDate } from "@/lib/format";

export default async function ProfilePage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  const dbUser = await getUserByEmail(user.email ?? "");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Manage your personal information and how you sign in."
      />

      <Section
        title="Personal information"
        description="Update the name associated with your account."
      >
        <Card>
          <CardContent className="p-6">
            <ProfileForm defaultName={user.name ?? ""} email={user.email ?? ""} />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Email"
        description="Your email is your identity. Changing it requires verification."
      >
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Verified {user.emailVerified ? "yes" : "no"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Contact support to change your email.
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Password"
        description="Choose a strong password you don't use anywhere else."
      >
        <Card>
          <CardContent className="p-6">
            <PasswordForm />
          </CardContent>
        </Card>
      </Section>

      <Section title="Account" description="When you joined and last signed in.">
        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Created
              </p>
              <p className="text-sm">{formatDate(dbUser?.createdAt ?? user.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Last sign in
              </p>
              <p className="text-sm">{formatDate(session.session.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                User ID
              </p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                {user.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
