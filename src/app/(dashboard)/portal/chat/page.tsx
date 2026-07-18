import { redirect } from "next/navigation";

/** Legacy chat shell → Lucy */
export default function PortalChatRedirect() {
  redirect("/portal/lucy");
}
