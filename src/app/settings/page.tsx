import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { UserHubNav } from "@/components/user-hub-nav";
import { SiteFooter } from "@/components/site-footer";
import { SettingsClientPage } from "./components/settings-client-page";

export const metadata: Metadata = {
  title: "Account & Player Settings | GoxStream Anime Platform",
  description: "Customize your profile details, default player resolution, subtitle language, and security preferences.",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <UserHubNav />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SettingsClientPage />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
