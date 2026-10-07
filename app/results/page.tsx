import Candidates from "./candidates";

export const instant = false;

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";

  return <Candidates key={query} query={query} />;
}
