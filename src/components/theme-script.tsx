import { paletteInitScript, themeInitScript } from "@/lib/theme/preferences";

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: `${themeInitScript}${paletteInitScript}` }}
    />
  );
}
