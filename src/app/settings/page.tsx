import { Metadata } from "next";
import { SettingsClientPage } from "./components/settings-client-page";

export const metadata: Metadata = {
  title: "Account & Player Settings | GoxStream Anime Platform",
  description: "Customize your profile details, default player resolution, subtitle language, and security preferences.",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SettingsClientPage />
      </div>
    </div>
  );
}
