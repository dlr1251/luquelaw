export type ImmigrationLocale = "en" | "es";

/** English base path for the immigration hub. */
export const IMMIGRATION_BASE_EN = "/services/immigration";

/** Spanish base path for the immigration hub. */
export const IMMIGRATION_BASE_ES = "/es/servicios/migracion";

const SEGMENT_EN_TO_ES: Record<string, string> = {
  visas: "visas",
  nationality: "nacionalidad",
  extranjeria: "extranjeria",
  calculator: "calculadora",
};

const SEGMENT_ES_TO_EN: Record<string, string> = {
  visas: "visas",
  nacionalidad: "nationality",
  extranjeria: "extranjeria",
  calculadora: "calculator",
};

export type ImmigrationHubSection =
  | "overview"
  | "visas"
  | "nationality"
  | "extranjeria"
  | "calculator";

/** Build a hub path. `suffix` is English-style (`""`, `"/visas"`, `"/visas/turismo"`). */
export function immigrationPath(suffix: string, locale: ImmigrationLocale): string {
  const clean = suffix === "/" ? "" : suffix;
  if (locale === "en") {
    return `${IMMIGRATION_BASE_EN}${clean}`;
  }

  if (!clean) return IMMIGRATION_BASE_ES;

  const parts = clean.replace(/^\//, "").split("/");
  const mapped = parts.map((part, i) => {
    if (i === 0 && SEGMENT_EN_TO_ES[part]) return SEGMENT_EN_TO_ES[part];
    return part;
  });
  return `${IMMIGRATION_BASE_ES}/${mapped.join("/")}`;
}

/** Map an immigration hub pathname to the other locale. */
export function alternateImmigrationPath(pathname: string): string | undefined {
  if (pathname === IMMIGRATION_BASE_EN) return IMMIGRATION_BASE_ES;
  if (pathname === IMMIGRATION_BASE_ES) return IMMIGRATION_BASE_EN;

  if (pathname.startsWith(`${IMMIGRATION_BASE_EN}/`)) {
    const rest = pathname.slice(IMMIGRATION_BASE_EN.length);
    return immigrationPath(rest, "es");
  }

  if (pathname.startsWith(`${IMMIGRATION_BASE_ES}/`)) {
    const rest = pathname.slice(IMMIGRATION_BASE_ES.length).replace(/^\//, "");
    const parts = rest.split("/");
    const mapped = parts.map((part, i) => {
      if (i === 0 && SEGMENT_ES_TO_EN[part]) return SEGMENT_ES_TO_EN[part];
      return part;
    });
    return immigrationPath(`/${mapped.join("/")}`, "en");
  }

  return undefined;
}

export function immigrationSectionFromPath(pathname: string): ImmigrationHubSection {
  const stripped = pathname.startsWith(IMMIGRATION_BASE_ES)
    ? pathname.slice(IMMIGRATION_BASE_ES.length)
    : pathname.startsWith(IMMIGRATION_BASE_EN)
      ? pathname.slice(IMMIGRATION_BASE_EN.length)
      : "";

  const first = stripped.replace(/^\//, "").split("/")[0] ?? "";
  if (first === "visas") return "visas";
  if (first === "nationality" || first === "nacionalidad") return "nationality";
  if (first === "extranjeria") return "extranjeria";
  if (first === "calculator" || first === "calculadora") return "calculator";
  return "overview";
}
