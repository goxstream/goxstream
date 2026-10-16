import { SignupForm } from "@/components/auth/signup-form";

export function meta() {
  return [
    { title: "Create Account — ShionStream" },
    { name: "description", content: "Create a new ShionStream account to start streaming anime." },
  ];
}

export default function SignupPage() {
  return <SignupForm />;
}
