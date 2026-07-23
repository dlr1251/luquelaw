"use client";

import { useServerInsertedHTML } from "next/navigation";

import { paletteInitScript, themeInitScript } from "@/lib/theme/preferences";

/**
 * Injects blocking theme/palette init outside the React client tree
 * (via useServerInsertedHTML) so React 19 does not warn about <script>
 * tags rendered inside components.
 */
export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{
        __html: `${themeInitScript}${paletteInitScript}`,
      }}
    />
  ));

  return null;
}
