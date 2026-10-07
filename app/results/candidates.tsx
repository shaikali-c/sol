"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, MagnifyingGlass, MapPin, Sun } from "@phosphor-icons/react";

type Candidate = {
  name: string;
  role: string;
  years: number;
  location: string;
  match: number;
  skills: string;
};

const CANDIDATES: Candidate[] = [
  {
    name: "Amara Okafor",
    role: "Senior React Engineer",
    years: 9,
    location: "Lisbon, Portugal",
    match: 96,
    skills: "React, TypeScript, Next.js",
  },
  {
    name: "Diego Marín",
    role: "Frontend Engineer",
    years: 6,
    location: "Madrid, Spain",
    match: 91,
    skills: "React, Tailwind, Testing Library",
  },
  {
    name: "Priya Raman",
    role: "Full-Stack Engineer",
    years: 8,
    location: "Bengaluru, India",
    match: 84,
    skills: "Node.js, React, PostgreSQL",
  },
  {
    name: "Jonas Weber",
    role: "UI Engineer",
    years: 5,
    location: "Berlin, Germany",
    match: 76,
    skills: "Design systems, CSS, React",
  },
  {
    name: "Mei Lin",
    role: "Product Engineer",
    years: 7,
    location: "Singapore",
    match: 68,
    skills: "React, GraphQL, A/B testing",
  },
  {
    name: "Tomas Novak",
    role: "Junior Developer",
    years: 2,
    location: "Prague, Czechia",
    match: 41,
    skills: "React, JavaScript, SASS",
  },
];

const STAGES = ["Working", "Searching", "Finding", "Found it", "Filtered"];

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3.5 w-28 rounded bg-zinc-100" />
          <div className="h-3 w-36 rounded bg-zinc-100" />
        </div>
        <div className="h-3.5 w-9 rounded bg-zinc-100" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-3 w-3 rounded bg-zinc-100" />
        <div className="h-3 w-44 rounded bg-zinc-100" />
      </div>
      <div className="mt-2 h-3 w-32 rounded bg-zinc-100" />
    </div>
  );
}

export default function Candidates({ query }: { query: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < STAGES.length; i++) {
      timers.push(setTimeout(() => setStage(i), i * 400));
    }
    timers.push(setTimeout(() => setLoading(false), STAGES.length * 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative min-h-full overflow-x-clip bg-white text-zinc-900">
      <div
        aria-hidden="true"
        className="dotgrid pointer-events-none absolute inset-x-0 top-0 h-[260px]"
      />

      <header className="relative mx-auto flex h-14 w-full max-w-4xl items-center px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <Sun weight="fill" className="h-5 w-5 text-zinc-900" />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Sol
          </span>
        </Link>
      </header>

      <main className="relative mx-auto w-full max-w-4xl px-6 pb-28 pt-0 sm:pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = value.trim() || query;
            if (v !== query) router.push(`/results?q=${encodeURIComponent(v)}`);
          }}
        >
          <div className="flex h-11 max-w-2xl items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-zinc-300 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.10)] sm:px-4">
            <MagnifyingGlass
              aria-hidden="true"
              className="h-[18px] w-[18px] shrink-0 text-zinc-400"
            />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search candidates"
              aria-label="Search candidates"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-zinc-900 px-3 text-[13px] font-medium text-white transition-all hover:bg-blue-600 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em]">
            {query ? `Candidates for “${query}”` : "All candidates"}
          </h1>
          {!loading && (
            <p className="text-sm tabular-nums text-zinc-500">
              {CANDIDATES.length} ranked by match
            </p>
          )}
        </div>

        {loading && (
          <div className="mt-6" aria-live="polite">
            <div className="overflow-hidden">
              <span
                key={stage}
                className="word-swap block font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl"
              >
                {STAGES[stage]}
              </span>
            </div>
            <div className="mt-5 h-0.5 max-w-md overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div
            aria-label="Loading candidates"
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <ol className="rise mt-6 grid gap-4 sm:grid-cols-2">
            {CANDIDATES.map((c) => (
              <li key={c.name}>
                <article className="group h-full rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-[15px] font-medium tracking-tight">
                        {c.name}
                      </h2>
                      <p className="truncate text-sm text-zinc-500">
                        {c.role}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] font-semibold leading-none tabular-nums tracking-tight">
                      {c.match}
                      <span className="font-normal text-zinc-400">%</span>
                    </p>
                  </div>

                  <p className="mt-4 flex items-center gap-1.5 text-sm text-zinc-600">
                    <MapPin
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-zinc-400"
                    />
                    {c.location} · {c.years} years experience
                  </p>
                  <p className="mt-1.5 text-sm text-zinc-500">{c.skills}</p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
