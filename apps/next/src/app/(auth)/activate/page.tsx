import { Metadata } from "next"
import { ActivateForm } from "./components/activate-form"

export const metadata: Metadata = {
  title: "Activate Device — GoxStream",
  description: "Connect your Smart TV or device with your GoxStream account.",
}

export default function ActivatePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <ActivateForm />
      </div>
    </main>
  )
}
