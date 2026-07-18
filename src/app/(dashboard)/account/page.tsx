import { redirect } from "next/navigation";

/** Legacy `/account` → `/portal` (also covered by next.config redirects). */
export default function AccountRedirectPage() {
  redirect("/portal");
}
