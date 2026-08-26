import { Metadata } from "next"
import { SignupForm } from "./components/signup-form"

export const metadata: Metadata = {
  title: "Create Account — GoxStream",
  description: "Create a new GoxStream account to start streaming anime.",
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <SignupForm />
      </div>
    </main>
  )
}
