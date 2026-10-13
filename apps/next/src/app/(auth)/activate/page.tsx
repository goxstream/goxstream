import { Metadata } from "next";
import { ActivateForm } from "./components/activate-form";

export const metadata: Metadata = {
  title: "Activate Device — GoxStream",
  description: "Connect your Smart TV or device with your GoxStream account.",
};

export default function ActivatePage() {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="bg-primary/10 pointer-events-none absolute -top-40 -right-40 size-96 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <ActivateForm />
      </div>
    </main>
  );
}
