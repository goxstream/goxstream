import { redirect } from "next/navigation";

export default function NewEpisodePage() {
  redirect("/dashboard/episodes/new/basic");
}
