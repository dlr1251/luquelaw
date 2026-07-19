"use client";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { Container } from "@/components/container";

type Props = {
  buttonLabel: string;
};

export function BookingSection({ buttonLabel }: Props) {
  const { open } = useBookingModal();

  return (
    <section id="book" className="scroll-mt-28 border-b border-border bg-surface">
      <Container className="flex justify-center py-8 sm:py-10">
        <button type="button" onClick={open} className="btn-primary btn-primary-lg w-full sm:w-auto">
          {buttonLabel}
        </button>
      </Container>
    </section>
  );
}
