import { LoginForm } from "@/components/auth/login-form";

export function meta() {
  return [
    { title: "Sign In — GoxStream" },
    { name: "description", content: "Sign in to your GoxStream account to continue watching anime." },
  ];
}

export default function LoginPage() {
  return <LoginForm />;
}
