import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { CommunityQuestionView } from "@/components/community/question-view";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { getQuestionBySlug } from "@/lib/community/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ComunidadQuestionPage({ params }: Props) {
  const { slug } = await params;
  const data = await getQuestionBySlug(slug);
  if (!data) notFound();

  const [signedIn, viewerUserId] = await Promise.all([
    getSignedInFlag(),
    getSessionUserId(),
  ]);

  return (
    <main>
      <Container className="marketing-section">
        <CommunityQuestionView
          locale="es"
          question={data.question}
          answers={data.answers}
          questionComments={data.questionComments}
          answerComments={data.answerComments}
          viewerUserId={viewerUserId}
          signedIn={signedIn}
        />
      </Container>
    </main>
  );
}
