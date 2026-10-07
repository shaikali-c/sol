import Candidates from "./candidates";

export const instant = false;

const one = (v?: string | string[]) => (typeof v === "string" ? v : "");

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; exp?: string | string[]; loc?: string | string[]; notes?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = one(params.q);
  const exp = one(params.exp);
  const loc = one(params.loc);
  const notes = one(params.notes);

  return <Candidates key={query} query={query} exp={exp} loc={loc} notes={notes} />;
}
