import { permanentRedirect } from "next/navigation";

/** Listing moved to `/clkr`. Article permalinks stay at `/clkr/guides/[slug]`. */
export default function ClkrGuidesHubRedirect() {
  permanentRedirect("/clkr");
}
