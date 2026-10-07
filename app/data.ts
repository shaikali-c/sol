"use client";

import MiniSearch from "minisearch";

export type Candidate = {
  name: string;
  role: string;
  years: number;
  location: string;
  match: number;
  skills: string;
  source?: string;
  phone?: string;
  email?: string;
  remote?: boolean;
};

export const CANDIDATES: Candidate[] = [
  {
    name: "Ananya Iyer",
    role: "Senior React Engineer",
    years: 9,
    location: "Bengaluru, India",
    match: 96,
    skills: "React, TypeScript, Next.js",
  },
  {
    name: "Rohan Mehta",
    role: "Frontend Engineer",
    years: 6,
    location: "Pune, India",
    match: 91,
    skills: "React, Tailwind, Testing Library",
  },
  {
    name: "Fatima Sheikh",
    role: "Full-Stack Engineer",
    years: 8,
    location: "Hyderabad, India",
    match: 84,
    skills: "Node.js, React, PostgreSQL",
  },
  {
    name: "Arjun Nair",
    role: "UI Engineer",
    years: 5,
    location: "Kochi, India",
    match: 76,
    skills: "Design systems, CSS, React",
  },
  {
    name: "Priya Menon",
    role: "Product Engineer",
    years: 7,
    location: "Chennai, India",
    match: 68,
    skills: "React, GraphQL, A/B testing",
  },
  {
    name: "Vikram Singh",
    role: "Junior Developer",
    years: 2,
    location: "Jaipur, India",
    match: 41,
    skills: "React, JavaScript, SASS",
  },
];

// candidates pulled from public job boards during a search (no crawler wired up)
export const SCRAPED: Candidate[] = [
  {
    name: "Neha Kulkarni",
    role: "Senior React Engineer",
    years: 8,
    location: "Mumbai, India",
    match: 94,
    skills: "React, Next.js, GraphQL",
    source: "naukri.com",
    phone: "+91 98765 43210",
    email: "neha.kulkarni@example.com",
    remote: true,
  },
  {
    name: "Aditya Rao",
    role: "Frontend Engineer",
    years: 5,
    location: "Gurugram, India",
    match: 89,
    skills: "React, TypeScript, Vite",
    source: "linkedin.com",
    phone: "+91 98765 43211",
    email: "aditya.rao@example.com",
  },
  {
    name: "Sneha Patil",
    role: "Full-Stack Engineer",
    years: 7,
    location: "Delhi NCR, India",
    match: 82,
    skills: "React, Node.js, MongoDB",
    source: "wellfound.com",
    phone: "+91 98765 43212",
    email: "sneha.patil@example.com",
  },
  {
    name: "Karthik Subramanian",
    role: "Design Engineer",
    years: 6,
    location: "Bengaluru, India",
    match: 74,
    skills: "React, Figma, Design systems",
    source: "linkedin.com",
    phone: "+91 98765 43213",
    email: "karthik.s@example.com",
  },
  {
    name: "Ishita Bansal",
    role: "Frontend Engineer",
    years: 4,
    location: "Ahmedabad, India",
    match: 63,
    skills: "React, CSS, Storybook",
    source: "naukri.com",
    phone: "+91 98765 43214",
    email: "ishita.bansal@example.com",
  },
  {
    name: "Manish Gupta",
    role: "Software Engineer",
    years: 3,
    location: "Noida, India",
    match: 52,
    skills: "JavaScript, React, Redux",
    source: "wellfound.com",
    phone: "+91 98765 43215",
    email: "manish.gupta@example.com",
  },
  {
    name: "Rahul Deshpande",
    role: "C++ Software Engineer",
    years: 9,
    location: "Bengaluru, India",
    match: 95,
    skills: "C++, Qt, Multithreading",
    source: "linkedin.com",
    phone: "+91 98765 43216",
    email: "rahul.deshpande@example.com",
  },
  {
    name: "Priyanka Iyer",
    role: "Systems Engineer",
    years: 7,
    location: "Chennai, India",
    match: 90,
    skills: "C++, Linux, gRPC",
    source: "naukri.com",
    phone: "+91 98765 43217",
    email: "priyanka.iyer@example.com",
    remote: true,
  },
  {
    name: "Sanjay Kulkarni",
    role: "Embedded Engineer",
    years: 11,
    location: "Pune, India",
    match: 86,
    skills: "C++, Embedded, CAN bus",
    source: "linkedin.com",
    phone: "+91 98765 43218",
    email: "sanjay.kulkarni@example.com",
  },
  {
    name: "Aditi Sharma",
    role: "Backend Engineer",
    years: 6,
    location: "Hyderabad, India",
    match: 81,
    skills: "Java, Spring Boot, Kafka",
    source: "wellfound.com",
    phone: "+91 98765 43219",
    email: "aditi.sharma@example.com",
  },
  {
    name: "Ravi Teja",
    role: "Platform Engineer",
    years: 8,
    location: "Bengaluru, India",
    match: 78,
    skills: "Go, Kubernetes, AWS",
    source: "naukri.com",
    phone: "+91 98765 43220",
    email: "ravi.teja@example.com",
    remote: true,
  },
  {
    name: "Nikhil Varma",
    role: "Data Engineer",
    years: 5,
    location: "Hyderabad, India",
    match: 71,
    skills: "Python, Airflow, Spark",
    source: "linkedin.com",
    phone: "+91 98765 43221",
    email: "nikhil.varma@example.com",
  },
  {
    name: "Anushka Roy",
    role: "QA Automation Engineer",
    years: 4,
    location: "Kolkata, India",
    match: 66,
    skills: "Selenium, JavaScript, API testing",
    source: "wellfound.com",
    phone: "+91 98765 43222",
    email: "anushka.roy@example.com",
    remote: true,
  },
  {
    name: "Deepak Joshi",
    role: "Android Engineer",
    years: 7,
    location: "Indore, India",
    match: 69,
    skills: "Kotlin, Android, MVVM",
    source: "naukri.com",
    phone: "+91 98765 43223",
    email: "deepak.joshi@example.com",
    remote: true,
  },
  {
    name: "Rohan Verma",
    role: "Senior React Engineer",
    years: 9,
    location: "Hyderabad, India",
    match: 92,
    skills: "React, Redux, Next.js",
    source: "linkedin.com",
    phone: "+91 98765 43227",
    email: "rohan.verma@example.com",
    remote: true,
  },
  {
    name: "Aarav Bhatia",
    role: "Software Engineering Intern",
    years: 0,
    location: "Bengaluru, India",
    match: 44,
    skills: "JavaScript, React, Git",
    source: "linkedin.com",
    phone: "+91 98765 43224",
    email: "aarav.bhatia@example.com",
    remote: true,
  },
  {
    name: "Saanvi Kapoor",
    role: "Frontend Intern",
    years: 1,
    location: "Gurugram, India",
    match: 38,
    skills: "React, HTML, CSS",
    source: "naukri.com",
    phone: "+91 98765 43225",
    email: "saanvi.kapoor@example.com",
  },
  {
    name: "Ritwik Sen",
    role: "Graduate Developer",
    years: 1,
    location: "Kolkata, India",
    match: 47,
    skills: "JavaScript, Node.js, SQL",
    source: "wellfound.com",
    phone: "+91 98765 43226",
    email: "ritwik.sen@example.com",
  },
];

export const ALL_CANDIDATES: Candidate[] = [...CANDIDATES, ...SCRAPED];

/**
 * Relevance runs on MiniSearch: BM25 with per-field boosts, prefix and fuzzy
 * matching. Answers from the quiz are applied afterwards as hard requirements,
 * never as score, so a candidate only appears because the query matched.
 */
type Indexed = {
  id: string;
  name: string;
  role: string;
  skills: string;
  location: string;
  remote: string;
};

const FIELD_BOOST = { skills: 3, role: 2, location: 2, name: 1.5, remote: 1.5 };

const MINISEARCH = new MiniSearch<Indexed>({
  idField: "id",
  fields: ["skills", "role", "location", "name", "remote"],
  storeFields: ["id"],
  // lowercased before splitting: matching must be case-insensitive, and
  // "c++" / "c#" have to survive as single terms
  tokenize: (text) =>
    text
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .map((t) => t.replace(/\.+$/, ""))
      .filter(Boolean),
});

MINISEARCH.addAll(
  SCRAPED.map((c) => ({
    id: c.name,
    name: c.name,
    role: c.role,
    skills: c.skills,
    location: c.location,
    remote: c.remote ? "remote" : "",
  }))
);

// words recruiters type that mean something else on a profile
const ALIASES: Record<string, string[]> = {
  cplusplus: ["c++"],
  cpp: ["c++"],
  csharp: ["c#"],
  dotnet: ["c#"],
  js: ["javascript"],
  reactjs: ["react"],
  nextjs: ["next"],
  nodejs: ["node"],
  golang: ["go"],
  postgres: ["postgresql"],
  k8s: ["kubernetes"],
  ts: ["typescript"],
  py: ["python"],
  qa: ["selenium"],
};

// "developer" is how people talk, not a title they are filtering on
const ROLE_NOISE = new Set([
  "developer",
  "engineer",
  "engineers",
  "programmer",
  "dev",
  "role",
  "job",
  "work",
]);

// experience bands have a floor and a ceiling, so "intern" cannot return
// people with six years of experience
const BANDS = {
  Intern: { min: 0, max: 1 },
  Fresher: { min: 0, max: 2 },
  Junior: { min: 1, max: 3 },
  "Mid-level": { min: 3, max: 6 },
  Senior: { min: 6, max: Number.POSITIVE_INFINITY },
  Lead: { min: 9, max: Number.POSITIVE_INFINITY },
} as const;

type Band = keyof typeof BANDS;

const SENIORITY: Record<string, Band> = {
  intern: "Intern",
  trainee: "Intern",
  fresher: "Fresher",
  graduate: "Fresher",
  junior: "Junior",
  "mid-level": "Mid-level",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
  staff: "Lead",
  principal: "Lead",
};

const GENERIC_PLACES = new Set(["india", "remote", "anywhere", "any", "all"]);

const SHORT_TERMS = new Set([
  "js", "ts", "go", "py", "ml", "ai", "qa", "ui", "ux", "c", "r",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    // "in" must never match "India", so short filler words are dropped unless
    // they are real technology tokens
    .filter((t) => t.length >= 3 || SHORT_TERMS.has(t) || /[+#]/.test(t));
}

/**
 * each meaningful query word becomes a concept: the word, its stem and its
 * aliases. Concepts are ANDed, variants inside a concept are ORed, so
 * "golang react" needs both, and "golang" alone still finds the Go engineer.
 */
function concepts(query: string): { terms: string[][]; noise: string[] } {
  const terms: string[][] = [];
  const noise: string[] = [];
  for (const token of tokenize(query)) {
    if (ROLE_NOISE.has(token)) {
      noise.push(token);
      continue;
    }
    const stem = token.endsWith("s") && token.length > 3 ? token.slice(0, -1) : token;
    const variants = new Set<string>([token, stem]);
    for (const alias of ALIASES[token] ?? []) variants.add(alias);
    for (const alias of ALIASES[stem] ?? []) variants.add(alias);
    terms.push([...variants]);
  }
  return { terms, noise };
}

export type ParsedNotes = { tokens: string[]; minYears?: number };

/** pulls skills and hard requirements like "5+ years" out of free text */
export function parseNotes(notes: string): ParsedNotes {
  const years = [...notes.matchAll(/(\d+)\s*\+?\s*(?:year|yr)/gi)].map((m) =>
    Number(m[1])
  );
  const tokens = tokenize(notes.replace(/\d+\s*\+?\s*(?:year|yr)/gi, " "));
  return { tokens, minYears: years.length ? Math.max(...years) : undefined };
}

/** everything fetched today, best match first, used when a search is empty */
export function baseMatches(): Candidate[] {
  return [...SCRAPED].sort((a, b) => b.match - a.match);
}

export type MatchResult = {
  candidate: Candidate;
  score: number;
  /** query words this candidate actually hit, for on-card display */
  terms: string[];
};

export type MatchOutcome = {
  results: MatchResult[];
  /** candidates the query matched before the quiz answers were applied */
  beforeRequirements: number;
};

export function matchScraped(
  query: string,
  exp = "",
  loc = "",
  notes = ""
): MatchOutcome {
  const byName = new Map(SCRAPED.map((c) => [c.name, c]));
  const { terms, noise } = concepts(query);
  // "engineers" on its own is still a search: fall back to the words we
  // treated as noise when nothing else was asked for
  const wanted = terms.length
    ? terms
    : noise.map((word) => [
        word,
        ...(word.endsWith("s") && word.length > 3 ? [word.slice(0, -1)] : []),
      ]);
  if (!wanted.length) return { results: [], beforeRequirements: 0 };

  const asked = tokenize(query)
    .map((t) => SENIORITY[t])
    .filter((k): k is Band => Boolean(k));
  const bands = [exp, ...asked]
    .filter((k): k is Band => Boolean(k) && k in BANDS)
    .map((k) => BANDS[k]);
  const parsed = parseNotes(notes);
  const minYears = Math.max(0, ...bands.map((b) => b.min), parsed.minYears ?? 0);
  const maxYears = Math.min(Number.POSITIVE_INFINITY, ...bands.map((b) => b.max));
  const locTokens = tokenize(loc).filter((t) => !GENERIC_PLACES.has(t));

  const search = (variants: string[]) =>
    MINISEARCH.search(variants.join(" "), {
      boost: FIELD_BOOST,
      combineWith: "OR",
      prefix: true,
      fuzzy: 0.2,
    });

  let hits = search(wanted[0]);
  for (const concept of wanted.slice(1)) {
    const ids = new Set(search(concept).map((h) => String(h.id)));
    hits = hits.filter((h) => ids.has(String(h.id)));
  }
  if (!hits.length) return { results: [], beforeRequirements: 0 };

  const beforeRequirements = hits.length;

  return { results: hits
    .flatMap((hit) => {
      const candidate = byName.get(String(hit.id));
      if (!candidate) return [];
      const terms = hit.terms as string[];

      // experience is a requirement, never a score bonus
      if (candidate.years < minYears || candidate.years > maxYears) return [];
      if (
        locTokens.length > 0 &&
        !locTokens.some((t) => candidate.location.toLowerCase().includes(t))
      ) {
        return [];
      }

      let score = hit.score;
      const role = `${candidate.role} ${candidate.skills}`.toLowerCase();
      if (noise.some((t) => role.includes(t))) score += 2;
      // notes are a wish list: weak signal on top of relevance
      for (const token of parsed.tokens) if (role.includes(token)) score += 1;
      return [{ candidate, score, terms }];
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.match - a.candidate.match),
    beforeRequirements };
}

// saved profiles live in localStorage so the shortlist survives a reload
const KEY = "sol-saved";
const EVENT = "sol-saved-changed";

let cache: string[] | null = null;

const EMPTY: string[] = [];

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return EMPTY;
  }
}

export function getSaved(): string[] {
  if (cache === null) cache = read();
  return cache;
}

export function getSavedServer(): string[] {
  return EMPTY;
}

export function toggleSaved(name: string) {
  const cur = getSaved();
  cache = cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name];
  localStorage.setItem(KEY, JSON.stringify(cache));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeSaved(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// session-scoped record of queries the user actually searched, so revisiting a
// page does not replay the loading sequence
export const SEEN_KEY = "sol-searched";

export function searchedBefore(q: string): boolean {
  // opening a tab without a query is browsing, not searching
  if (!q) return true;
  if (typeof window === "undefined") return false;
  try {
    return (JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[]).includes(q);
  } catch {
    return false;
  }
}

export function markSearched(q: string) {
  try {
    const seen = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[];
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...new Set([...seen, q])]));
  } catch {
    // sessionStorage unavailable (private mode): fall back to always animating
  }
}

// freeze the answer per query: the store re-reads its snapshot after mount, and
// markSearched() would otherwise flip it mid-animation and cancel the sequence
const frozen = new Map<string, boolean>();

export function returningTo(q: string): boolean {
  if (!frozen.has(q)) frozen.set(q, searchedBefore(q));
  return frozen.get(q) as boolean;
}

export function forgetSearch(q: string) {
  frozen.set(q, false);
  try {
    const seen = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[];
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen.filter((x) => x !== q)));
  } catch {}
}

export function subscribeNothing() {
  return () => {};
}
