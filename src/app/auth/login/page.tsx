import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account with a magic link, password, or Google.",
  openGraph: {
    title: "Sign in",
    description: "Sign in to your account with a magic link, password, or Google.",
  },
};

// LoginForm reads ?redirectTo= via useSearchParams and needs a Suspense
// boundary so the page can be statically prerendered.
export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
