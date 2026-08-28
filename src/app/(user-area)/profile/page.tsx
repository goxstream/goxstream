import { Metadata } from "next";
import { ProfileContentClient } from "./components/profile-content-client";

export const metadata: Metadata = {
  title: "User Profile | GoxStream Anime Platform",
  description: "View your anime statistics, streaming activity, and favorite genres.",
};

export default function ProfilePage() {
  return <ProfileContentClient />;
}
