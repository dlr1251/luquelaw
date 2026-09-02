import type { ReactNode } from "react";

import { Container } from "@/components/container";

type Props = {
  children: ReactNode;
};

export function BookingSection({ children }: Props) {
  return (
    <section id="book" className="scroll-mt-28 border-b border-border bg-surface">
      <Container className="py-8 sm:py-10 lg:py-14">{children}</Container>
    </section>
  );
}
