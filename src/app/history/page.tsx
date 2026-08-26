import { Metadata } from "next";
import { HistoryClientPage } from "./components/history-client-page";

export const metadata: Metadata = {
  title: "Watch History | GoxStream Anime Platform",
  description: "View and manage your anime streaming history, resume episode watch progress.",
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <HistoryClientPage />
      </div>
    </div>
  );
}
