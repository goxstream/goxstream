"use client";

import DecryptedText from "@/components/DecryptedText";

export default function SandboxPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        <DecryptedText
          text="GoxStream & React Bits"
          animateOn="view"
          speed={60}
          className="text-primary"
          encryptedClassName="text-muted-foreground opacity-70"
        />
      </h1>
      <p className="text-muted-foreground max-w-md text-center">
        Hover over the text or refresh the page to see the decryption animation effect. This proves
        the integration works perfectly!
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium shadow transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
