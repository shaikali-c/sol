"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, MagnifyingGlass, Sun } from "@phosphor-icons/react";
import RefineDialog, { searchHref } from "./refine";

const EXAMPLES = [
  "senior react developer, remote",
  "product designer with fintech experience",
  "ml engineer for a seed-stage startup",
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const runSearch = (value: string) => {
    setPending(value.trim() || EXAMPLES[0]);
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-zinc-100 text-zinc-900">

      <header className="relative mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-6">
        <span className="flex items-center gap-2.5">
          <Sun weight="fill" className="h-5 w-5 text-zinc-900" />
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Sol
          </span>
        </span>
      </header>

      <main className="relative mx-auto w-full max-w-4xl px-6 pb-28 pt-6 sm:pt-8">
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
            <div className="flex h-14 items-center gap-3 rounded-full border border-zinc-200 bg-white pl-5 pr-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] transition-all hover:border-zinc-300 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]">
              <MagnifyingGlass
                aria-hidden="true"
                weight="bold"
                className="h-5 w-5 shrink-0 text-zinc-500"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "senior react developer, remote"'
                aria-label="Search candidates"
                className="h-full min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-zinc-500"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <ArrowRight weight="bold" className="h-[18px] w-[18px]" />
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

      {pending !== null && (
        <RefineDialog
          query={pending}
          onCancel={() => setPending(null)}
          onSubmit={(exp, loc, notes) => {
            router.push(searchHref(pending, exp, loc, notes));
            setPending(null);
          }}
        />
      )}
    </div>
  );
}
