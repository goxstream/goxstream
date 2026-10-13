import { SiteHeader } from "@/components/site-header";
import { UserAreaSidebar } from "@/components/user-area-sidebar";
import { SiteFooter } from "@/components/site-footer";

export default function UserAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Vidio-Style Customer Portal Sidebar */}
            <div className="w-full md:w-64 lg:w-72 shrink-0 md:sticky md:top-20">
              <UserAreaSidebar />
            </div>

            {/* Main Page Area Content */}
            <div className="flex-1 min-w-0 w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}


