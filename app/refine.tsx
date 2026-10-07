"use client";

import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Crown,
  Infinity as InfinityIcon,
  MapPin,
  NotePencil,
  RocketLaunch,
  Student,
  User,
  Users,
} from "@phosphor-icons/react";

const EXPERIENCE = [
  { label: "Any", Icon: InfinityIcon },
  { label: "Intern", Icon: Student },
  { label: "Fresher", Icon: RocketLaunch },
  { label: "Junior", Icon: User },
  { label: "Mid-level", Icon: Users },
  { label: "Senior", Icon: Briefcase },
  { label: "Lead", Icon: Crown },
];

export function searchHref(
  q: string,
  exp?: string,
  loc?: string,
  notes?: string
) {
  const p = new URLSearchParams();
  p.set("q", q);
  if (exp && exp !== "Any") p.set("exp", exp);
  if (loc) p.set("loc", loc);
  if (notes) p.set("notes", notes);
  return `/results?${p.toString()}`;
}

export default function RefineDialog({
  query,
  onCancel,
  onSubmit,
}: {
  query: string;
  onCancel: () => void;
  onSubmit: (exp: string, loc: string, notes: string) => void;
}) {
  const [exp, setExp] = useState("Any");
  const [loc, setLoc] = useState("");
  const [notes, setNotes] = useState("");
  const first = useRef<HTMLDivElement>(null);

  useEffect(() => {
    first.current?.querySelector("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-zinc-900/20 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="refine-title"
        className="relative w-full max-w-md rounded-[20px] border border-zinc-200 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
      >
        <p className="text-[13px] text-zinc-500">Search “{query}”</p>
        <h2
          id="refine-title"
          className="mt-1 font-display text-[17px] font-semibold tracking-[-0.01em]"
        >
          A few quick questions
        </h2>

        <fieldset className="mt-5">
          <legend className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-700">
            <Briefcase className="h-4 w-4 text-zinc-400" />
            How much experience is needed?
          </legend>
          <div ref={first} role="radiogroup" className="mt-2.5 flex flex-wrap gap-1.5">
            {EXPERIENCE.map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={exp === label}
                onClick={() => setExp(label)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  exp === label
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                <Icon weight="bold" className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label
            htmlFor="refine-location"
            className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-700"
          >
            <MapPin className="h-4 w-4 text-zinc-400" />
            Any location preferred?
          </label>
          <input
            id="refine-location"
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            placeholder="Berlin, remote, EU…"
            className="mt-2 h-10 w-full rounded-full border border-zinc-200 bg-white px-3.5 text-sm outline-none transition-all placeholder:text-zinc-500 focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="refine-notes"
            className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-700"
          >
            <NotePencil className="h-4 w-4 text-zinc-400" />
            Additional notes
          </label>
          <textarea
            id="refine-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else we should know?"
            className="mt-2 w-full resize-none rounded-[20px] border border-zinc-200 bg-white px-3.5 py-2.5 text-sm leading-6 outline-none transition-all placeholder:text-zinc-500 focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-[13px] font-medium text-zinc-700 transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(exp, loc.trim(), notes.trim())}
            className="rounded-full bg-blue-600 px-4 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
