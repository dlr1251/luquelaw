import { permanentRedirect } from "next/navigation";

/** Listing moved to `/es/clkr`. Article permalinks stay at `/es/clkr/guides/[slug]`. */
export default function ClkrGuidesHubEsRedirect() {
  permanentRedirect("/es/clkr");
}
