import { redirect } from "next/navigation";

/** Legacy chat shell → Torny */
export default function PortalChatRedirect() {
  redirect("/portal/lucy");
}
