import { Metadata } from "next";
import { HistoryClientPage } from "./components/history-client-page";

export const metadata: Metadata = {
  title: "Watch History | GoxStream Anime Platform",
  description: "View and manage your anime streaming history, resume episode watch progress.",
};

export default function HistoryPage() {
  return <HistoryClientPage />;
}
