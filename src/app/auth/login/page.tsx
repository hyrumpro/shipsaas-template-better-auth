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

export default function Login() {
  return <LoginForm />;
}
