import type { ClkrSection } from "@/lib/clkr/types";

type Props = {
  sections: ClkrSection[];
};

export function ClkrSectionBody({ sections }: Props) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          {section.html ? (
            <div
              className="clkr-section-html"
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
          ) : null}
        </div>
      ))}
    </>
  );
}
