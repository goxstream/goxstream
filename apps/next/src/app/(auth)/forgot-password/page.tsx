import { Metadata } from "next"
import { ForgotPasswordForm } from "./components/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password — GoxStream",
  description: "Reset your GoxStream account password.",
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <ForgotPasswordForm />
      </div>
    </main>
  )
}
