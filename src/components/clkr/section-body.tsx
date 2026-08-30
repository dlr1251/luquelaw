import { prepareClkrSectionHtml } from "@/lib/clkr/framework-html";
import type { ClkrSection } from "@/lib/clkr/types";

type Props = {
  sections: ClkrSection[];
  locale?: "en" | "es";
};

export function ClkrSectionBody({ sections, locale = "en" }: Props) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.html ? (
            <div
              className="clkr-section-html"
              dangerouslySetInnerHTML={{
                __html: prepareClkrSectionHtml(section.html, {
                  locale,
                  sectionId: section.id,
                }),
              }}
            />
          ) : null}
        </div>
      ))}
    </>
  );
}
