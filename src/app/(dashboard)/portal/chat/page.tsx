import { redirect } from "next/navigation";

/** Legacy chat shell → Lucy AI */
export default function PortalChatRedirect() {
  redirect("/portal/lucy");
}
