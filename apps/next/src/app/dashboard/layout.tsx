import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardAuthGuard } from "./components/dashboard-auth-guard";

export const metadata: Metadata = {
  title: "Master Control Dashboard | GoxStream Enterprise",
  description: "Administrative control center for GoxStream anime streaming platform.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAuthGuard>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="bg-background flex min-h-screen min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthGuard>
  );
}
