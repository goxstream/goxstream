import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Persistent Public Layout wrapper that holds SiteHeader and SiteFooter
 * centered across all public routes, preventing Header/Footer unmounting and flickering.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
