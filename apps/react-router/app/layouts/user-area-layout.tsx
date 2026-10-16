import { Outlet } from "react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthGuard } from "@/components/auth-guard";
import { UserAreaSidebar } from "@/components/user-area-sidebar";

export default function UserAreaLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <AuthGuard>
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col items-start gap-6 md:flex-row md:gap-8">
              <div className="w-full shrink-0 md:sticky md:top-20 md:w-64 lg:w-72">
                <UserAreaSidebar />
              </div>
              <div className="w-full min-w-0 flex-1">
                <Outlet />
              </div>
            </div>
          </div>
        </AuthGuard>
      </main>
      <SiteFooter />
    </div>
  );
}
