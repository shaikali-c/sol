"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import RefineDialog, { searchHref } from "../refine";
import { CANDIDATES, getSaved, getSavedServer, subscribeSaved, toggleSaved } from "../data";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Binoculars,
  CheckCircle,
  Funnel,
  Gear,
  MagnifyingGlass,
  BookmarkSimple,
  MapPin,
  Sun,
} from "@phosphor-icons/react";
import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type TargetAndTransition,
  type Variants,
} from "motion/react";

const STAGE_MS = 900;

const STAGES: { label: string; Icon: typeof Gear; animate: TargetAndTransition }[] = [
  { label: "Working", Icon: Gear, animate: { rotate: 360, transition: { duration: 2.4, repeat: Infinity, ease: "linear" } } },
  { label: "Searching", Icon: MagnifyingGlass, animate: { rotate: [-10, 10, -10], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } } },
  { label: "Finding", Icon: Binoculars, animate: { x: [-2, 2, -2], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } } },
  { label: "Found it", Icon: CheckCircle, animate: { scale: [1, 1.12, 1], transition: { duration: 1.3, repeat: Infinity, ease: "easeInOut" } } },
  { label: "Filtered", Icon: Funnel, animate: { y: [-2, 2, -2], transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" } } },
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

const SEEN_KEY = "sol-searched";

function searchedBefore(q: string): boolean {
  // opening the Search tab lands here without a query: that's browsing, not searching
  if (!q) return true;
  if (typeof window === "undefined") return false;
  try {
    return (JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[]).includes(q);
  } catch {
    return false;
  }
}

function markSearched(q: string) {
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

function returningTo(q: string): boolean {
  if (!frozen.has(q)) frozen.set(q, searchedBefore(q));
  return frozen.get(q) as boolean;
}

function forgetSearch(q: string) {
  frozen.set(q, false);
  try {
    const seen = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[];
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen.filter((x) => x !== q)));
  } catch {}
}

function subscribeNothing() {
  return () => {};
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
  const filtered = CANDIDATES.filter((c) => {
    if (filter === "top") return c.match >= 90;
    if (filter === "good") return c.match >= 70 && c.match < 90;
    if (filter === "other") return c.match < 70;
    return true;
  });
  const TABS = [
    { id: "all", label: "All", count: CANDIDATES.length },
    { id: "top", label: "Top match", count: CANDIDATES.filter((c) => c.match >= 90).length },
    { id: "good", label: "Good match", count: CANDIDATES.filter((c) => c.match >= 70 && c.match < 90).length },
    { id: "other", label: "Other", count: CANDIDATES.filter((c) => c.match < 70).length },
  ] as const;
  const current = STAGES[stage];
  const StageIcon = current.Icon;

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
    <div className="relative min-h-full overflow-x-clip bg-white text-zinc-900">

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
              {filtered.length} ranked by match
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

        {loading && (
          <MotionConfig reducedMotion="user">
            <div className="mt-6" aria-live="polite">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={stage}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center justify-center"
                    >
                      <motion.span
                        animate={current.animate}
                        className="flex items-center justify-center"
                      >
                        <StageIcon className="h-7 w-7 text-blue-600" />
                      </motion.span>
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="overflow-hidden">
                  <span
                    key={stage}
                    className="word-swap block font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl"
                  >
                    {current.label}
                  </span>
                </div>
              </div>
              <div className="mt-5 h-0.5 max-w-md overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all ease-out"
                  style={{
                    width: `${((stage + 1) / STAGES.length) * 100}%`,
                    transitionDuration: `${STAGE_MS}ms`,
                  }}
                />
              </div>
            </div>
          </MotionConfig>
        )}

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
        ) : (
          <MotionConfig reducedMotion="user">
          <motion.ol
            variants={LIST}
            initial="hidden"
            animate="show"
            className="mt-6 grid gap-6 sm:grid-cols-2"
          >
            {filtered.map((c, i) => (
              <motion.li key={c.name} variants={ITEM} className="h-full">
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
                      onClick={() => toggleSaved(c.name)}
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
                          {c.years} years experience
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
                              transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </svg>
                          <span className="text-[11px] font-semibold tabular-nums tracking-tight text-zinc-900">
                            <CountUp to={c.match} delay={0.05 + i * 0.05} />
                            <span className="text-zinc-500">%</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500">match</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
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
            ))}
          </motion.ol>
          </MotionConfig>
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
