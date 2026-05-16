import { ClkrHub } from "@/components/clkr/clkr-hub";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";

export default async function ClkrHubPage() {
  const articles = await getHubArticles("en");
  return <ClkrHub articles={articles} locale="en" />;
}
