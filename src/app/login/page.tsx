import { Metadata } from "next"
import { LoginForm } from "./components/login-form"

export const metadata: Metadata = {
  title: "Sign In — GoxStream",
  description: "Sign in to your GoxStream account to continue watching anime.",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </main>
  )
}
