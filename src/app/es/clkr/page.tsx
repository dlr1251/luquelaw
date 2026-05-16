import { ClkrHub } from "@/components/clkr/clkr-hub";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";

export default async function ClkrHubEsPage() {
  const articles = await getHubArticles("es");
  return <ClkrHub articles={articles} locale="es" />;
}
