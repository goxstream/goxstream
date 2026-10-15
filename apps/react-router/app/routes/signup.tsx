import { SignupForm } from "@/components/auth/signup-form";

export function meta() {
  return [
    { title: "Create Account — GoxStream" },
    { name: "description", content: "Create a new GoxStream account to start streaming anime." },
  ];
}

export default function SignupPage() {
  return <SignupForm />;
}
