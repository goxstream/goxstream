import { redirect } from "next/navigation";

export default function SigninRedirectPage() {
  redirect("/login");
}
