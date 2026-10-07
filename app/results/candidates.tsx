"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import RefineDialog, { searchHref } from "../refine";
import StageLoader, { type Stage } from "../stage-loader";
import {
  baseMatches,
  forgetSearch,
  matchScraped,
  getSaved,
  getSavedServer,
  markSearched,
  returningTo,
  subscribeNothing,
  subscribeSaved,
  toggleSaved,
  type Candidate,
} from "../data";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  BookmarkSimple,
  CheckCircle,
  CloudArrowDown,
  Gear,
  MagnifyingGlass,
  MapPin,
  Sun,
  Trophy,
} from "@phosphor-icons/react";
import {
  animate,
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "motion/react";

const STAGE_MS = 900;

const STAGES: Stage[] = [
  { label: "Working", Icon: Gear, animate: { rotate: 360, transition: { duration: 2.4, repeat: Infinity, ease: "linear" } } },
  { label: "Searching", Icon: MagnifyingGlass, animate: { rotate: [-10, 10, -10], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } } },
  { label: "Scraping", Icon: CloudArrowDown, animate: { y: [-3, 2, -3], transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" } } },
  { label: "Matching", Icon: CheckCircle, animate: { scale: [1, 1.12, 1], transition: { duration: 1.3, repeat: Infinity, ease: "easeInOut" } } },
  { label: "Ranked", Icon: Trophy, animate: { opacity: [1, 0.55, 1], transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } } },
];

const LIST: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0 } },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function CountUp({ to, delay }: { to: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [to, delay, reduce]);
  return <span ref={ref}>0</span>;
}

function CandidateCard({
  candidate: c,
  index,
  terms,
  saved,
  onToggleSave,
}: {
  candidate: Candidate;
  index: number;
  terms: string[];
  saved: string[];
  onToggleSave: (name: string) => void;
}) {
  return (
    <motion.li variants={ITEM} className="h-full">

      <article className="flex h-full flex-col rounded-[20px] border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold tracking-tight">
              {c.name}
            </h2>
            <p className="truncate text-sm text-zinc-500">{c.role}</p>
          </div>
          <button
            aria-label={saved.includes(c.name) ? `Remove ${c.name} from saved` : `Save ${c.name}`}
            aria-pressed={saved.includes(c.name)}
            onClick={() => onToggleSave(c.name)}
            className={`shrink-0 rounded-full p-1 transition-all active:scale-90 focus-visible:outline-2 focus-visible:outline-blue-600 ${saved.includes(c.name) ? "text-blue-600" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            <BookmarkSimple weight={saved.includes(c.name) ? "fill" : "regular"} className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 border-t border-zinc-100 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-sm text-zinc-700">
                <MapPin
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-zinc-400"
                />
                {c.location}
              </p>
              <p className="mt-1 truncate text-sm text-zinc-500">
                {c.source
                  ? `${c.years} years, via ${c.source}`
                  : `${c.years} years experience`}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1">
              <div
                role="img"
                aria-label={`${c.match}% match`}
                className="relative flex h-12 w-12 items-center justify-center"
              >
                <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-zinc-100" />
                  <motion.circle
                    cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" strokeLinecap="round"
                    className={c.match >= 90 ? "stroke-blue-600" : "stroke-zinc-900"}
                    strokeDasharray={`${2 * Math.PI * 15.5}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 15.5 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 15.5 * (1 - c.match / 100) }}
                    transition={{ duration: 0.9, delay: 0.15 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
                <span className="text-[11px] font-semibold tabular-nums tracking-tight text-zinc-900">
                  <CountUp to={c.match} delay={0.05 + index * 0.05} />
                  <span className="text-zinc-500">%</span>
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">match</span>
            </div>
          </div>
        </div>

        {terms.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-zinc-500">matched</span>
            {terms.slice(0, 3).map((term) => (
              <span
                key={term}
                className="rounded-md bg-blue-50 px-2 py-0.5 text-[12px] text-blue-700"
              >
                {term}
              </span>
            ))}
            {terms.length > 3 && (
              <span className="text-[12px] text-zinc-500">
                +{terms.length - 3}
              </span>
            )}
          </div>
        )}

        <div className={`flex flex-wrap gap-1.5 ${terms.length > 0 ? "mt-3" : "mt-4"}`}>
          {c.skills.split(", ").map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[12px] text-zinc-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </article>
      </motion.li>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[20px] border border-zinc-200 bg-white p-5">
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

export default function Candidates({
  query,
  exp = "",
  loc = "",
  notes = "",
}: {
  query: string;
  exp?: string;
  loc?: string;
  notes?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [asking, setAsking] = useState(false);
  const saved = useSyncExternalStore(subscribeSaved, getSaved, getSavedServer);
  const returning = useSyncExternalStore(
    subscribeNothing,
    () => returningTo(query),
    () => false
  );
  const [done, setDone] = useState(false);
  const [stage, setStage] = useState(0);
  const [filter, setFilter] = useState<"all" | "top" | "good" | "other">("all");
  const { results: hits, beforeRequirements } = matchScraped(query, exp, loc, notes);
  // the base fetch only stands in when the query matched nothing at all; if the
  // quiz answers ruled everything out, that is an honest empty result
  const showingBase = beforeRequirements === 0;
  const results = showingBase
    ? baseMatches().map((candidate) => ({ candidate, score: 0, terms: [] }))
    : hits;
  const byFilter = (f: typeof filter) =>
    results.filter(({ candidate }) =>
      f === "top"
        ? candidate.match >= 90
        : f === "good"
          ? candidate.match >= 70 && candidate.match < 90
          : f === "other"
            ? candidate.match < 70
            : true
    );
  const filtered = byFilter(filter);
  const TABS = [
    { id: "all", label: "All", count: results.length },
    { id: "top", label: "Top match", count: byFilter("top").length },
    { id: "good", label: "Good match", count: byFilter("good").length },
    { id: "other", label: "Other", count: byFilter("other").length },
  ] as const;

  useEffect(() => {
    if (returning || done) return;
    markSearched(query);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < STAGES.length; i++) {
      timers.push(setTimeout(() => setStage(i), i * STAGE_MS));
    }
    timers.push(setTimeout(() => setDone(true), STAGES.length * STAGE_MS));
    return () => timers.forEach(clearTimeout);
  }, [query, returning, done]);

  const loading = !returning && !done;

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-zinc-100 text-zinc-900">

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

      <main className="relative mx-auto w-full max-w-4xl px-6 pb-28 pt-6 sm:pt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = value.trim() || query;
            if (v !== query) forgetSearch(v);
            setAsking(true);
          }}
        >
          <div className="flex h-12 max-w-2xl items-center gap-2.5 rounded-full border border-zinc-200 bg-white pl-4 pr-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-zinc-300 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.10)] sm:pl-5">
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
              aria-label="Search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <ArrowRight weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em]">
            {query ? `Candidates for “${query}”` : "All candidates"}
          </h1>
          {!loading && (
            <p className="text-sm tabular-nums text-zinc-500">
              {showingBase
                ? `${results.length} candidates fetched today`
                : `${hits.length} scraped for this search`}
            </p>
          )}
        </div>

        {(exp || loc || notes) && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {[exp, loc, notes].filter(Boolean).map((detail) => (
              <span
                key={detail}
                className="max-w-full truncate rounded-md bg-zinc-100 px-2 py-0.5 text-[12px] text-zinc-600"
              >
                {detail}
              </span>
            ))}
          </div>
        )}

        {loading && <StageLoader stages={STAGES} stage={stage} totalMs={STAGE_MS} />}

        {!loading && (
          <MotionConfig reducedMotion="user">
            <div
              role="tablist"
              aria-label="Filter candidates"
              className="mt-6 inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full border border-zinc-200 bg-white p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map((t) => {
                const active = filter === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(t.id)}
                    className={`relative isolate shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      active ? "text-white" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="filter-thumb"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        className="absolute inset-0 -z-10 rounded-full bg-zinc-900"
                      />
                    )}
                    {t.label}
                    <span className={`ml-1.5 text-[13px] tabular-nums ${active ? "text-zinc-400" : "text-zinc-500"}`}>
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </MotionConfig>
        )}

        {loading ? (
          <div
            aria-label="Loading candidates"
            className="mt-6 grid gap-6 sm:grid-cols-2"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <MotionConfig reducedMotion="user">
            <motion.ol
              variants={LIST}
              initial="hidden"
              animate="show"
              className="mt-6 grid gap-6 sm:grid-cols-2"
            >
              {filtered.map(({ candidate, terms }, i) => (
                <CandidateCard
                  key={candidate.name}
                  candidate={candidate}
                  index={i}
                  terms={terms}
                  saved={saved}
                  onToggleSave={toggleSaved}
                />
              ))}
            </motion.ol>
          </MotionConfig>
        ) : (
          <p className="mt-8 text-sm text-zinc-500">
            {showingBase && query
              ? "Nothing we fetched matches that. Everyone fetched today is listed instead."
              : "None of the fetched candidates meet those requirements. Try widening the experience band or the city."}
          </p>
        )}
      </main>

      {asking && (
        <RefineDialog
          query={value.trim() || query}
          onCancel={() => setAsking(false)}
          onSubmit={(e, l, n) => {
            const q = value.trim() || query;
            forgetSearch(q);
            router.push(searchHref(q, e, l, n));
            setAsking(false);
          }}
        />
      )}
    </div>
  );
}
