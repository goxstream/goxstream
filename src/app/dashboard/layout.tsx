import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { DashboardHeader } from "./components/dashboard-header";
import { getCurrentUser } from "@/lib/auth/session";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

export const metadata: Metadata = {
  title: "Master Control Dashboard | GoxStream Enterprise",
  description: "Administrative control center for GoxStream anime streaming platform.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Defense-in-depth Server Component Guard:
  // Restrict Dashboard access strictly to Non-User staff roles
  if (user && user.role === "user") {
    redirect("/");
  }

  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value;
  const defaultOpen = sidebarCookie === undefined ? true : sidebarCookie === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 min-w-0 min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
