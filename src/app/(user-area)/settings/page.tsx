import { Metadata } from "next";
import { SettingsClientPage } from "./components/settings-client-page";

export const metadata: Metadata = {
  title: "Account & Player Settings | GoxStream Anime Platform",
  description: "Customize your profile details, default player resolution, subtitle language, and security preferences.",
};

export default function SettingsPage() {
  return <SettingsClientPage />;
}
