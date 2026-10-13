"use client";

import DecryptedText from "@/components/DecryptedText";

export default function SandboxPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground gap-6 px-4">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        <DecryptedText
          text="GoxStream & React Bits"
          animateOn="view"
          speed={60}
          className="text-primary"
          encryptedClassName="text-muted-foreground opacity-70"
        />
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Hover over the text or refresh the page to see the decryption animation effect. This proves the integration works perfectly!
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
