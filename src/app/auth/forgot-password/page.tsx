import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your account password. We'll email you a secure link.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
