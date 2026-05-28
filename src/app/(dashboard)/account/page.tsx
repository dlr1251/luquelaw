import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your matters</CardTitle>
          <CardDescription>
            After your initial consultation, a written legal concept and quotation are delivered
            within three business days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Active engagements and deliverables will be listed here as the portal grows. Until then,
            use the contact page for updates on your file.
          </p>
          <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">No active matter summary yet.</span> This
            space will show the matter reference, stage, and next milestone once an engagement is
            opened.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Book a one-hour consultation if you have not yet.</li>
              <li>Gather documents and a short timeline for the first call.</li>
              <li>Read relevant CLKR articles before the meeting when possible.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ButtonLink href="/#contact" variant="outline" className="w-full justify-start">
              Contact & booking
            </ButtonLink>
            <ButtonLink href="/clkr" variant="outline" className="w-full justify-start">
              CLKR legal library
            </ButtonLink>
            <p className="text-xs text-muted-foreground">
              Initial consultations are billed separately; scope and fees follow the written
              quotation.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For scheduling and case questions, email{" "}
            <a className="font-medium text-foreground underline" href="mailto:daniel@luquelaw.co">
              daniel@luquelaw.co
            </a>{" "}
            or use the contact form. Include your matter type and timeline.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
