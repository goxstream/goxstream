import { SiteHeader } from "@/components/site-header";
import { UserHubNav } from "@/components/user-hub-nav";
import { SiteFooter } from "@/components/site-footer";

export default function UserAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <UserHubNav />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
