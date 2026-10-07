"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, MagnifyingGlass, Sun } from "@phosphor-icons/react";

const EXAMPLES = [
  "senior react developer, remote",
  "product designer with fintech experience",
  "ml engineer for a seed-stage startup",
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const runSearch = (value: string) => {
    const v = value.trim() || EXAMPLES[0];
    router.push(`/results?q=${encodeURIComponent(v)}`);
  };

  return (
    <div className="relative min-h-full overflow-x-clip bg-white text-zinc-900">
      <div
        aria-hidden="true"
        className="dotgrid pointer-events-none absolute inset-x-0 top-0 h-[380px]"
      />

      <header className="relative mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-6">
        <span className="flex items-center gap-2.5">
          <Sun weight="fill" className="h-5 w-5 text-zinc-900" />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Sol
          </span>
        </span>
      </header>

      <main className="relative mx-auto w-full max-w-4xl px-6 pb-28 pt-0 sm:pt-2">
        <section className="rise">
          <h1 className="font-display max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Who are you looking for?
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-8 text-zinc-500">
            Describe the hire in plain words. Sol ranks candidates by match,
            from 0 to 100%.
          </p>

          <form
            className="mt-10 max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(query);
            }}
          >
            <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-zinc-300 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.10)] sm:px-4">
              <MagnifyingGlass
                aria-hidden="true"
                className="h-[18px] w-[18px] shrink-0 text-zinc-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "senior react developer, remote"'
                aria-label="Search candidates"
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 text-[13px] font-medium text-white transition-all hover:bg-blue-600 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Search
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-zinc-500">Try</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => runSearch(ex)}
                className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-600 transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {ex}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
