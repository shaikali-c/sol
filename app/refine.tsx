"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
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

const PLACES = [
  "Anywhere in India",
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
  "Pune",
  "Delhi NCR",
  "Chennai",
  "Remote",
];

const STEPS = ["Experience", "Location", "Notes"] as const;

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
  const [step, setStep] = useState(0);
  const [exp, setExp] = useState("Any");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter" && !e.shiftKey && step < STEPS.length - 1) {
        if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
        e.preventDefault();
        setStep(step + 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step, onCancel]);

  const selectedPlace = place || "Anywhere in India";
  const last = step === STEPS.length - 1;

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
          Narrow it down
        </h2>

        <div className="mt-5 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  i < step
                    ? "bg-blue-600 text-white"
                    : i === step
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {i < step ? <Check weight="bold" className="h-3 w-3" /> : i + 1}
              </span>
              <span
                className={`truncate text-[12px] ${
                  i === step ? "text-zinc-900" : "text-zinc-500"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="h-px flex-1 bg-zinc-200" />
              )}
            </div>
          ))}
        </div>

        <div ref={panel} className="mt-6 min-h-[184px]">
          {step === 0 && (
            <fieldset>
              <legend className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-700">
                <Briefcase className="h-4 w-4 text-zinc-400" />
                How much experience does the hire need?
              </legend>
              <div
                role="radiogroup"
                className="mt-3 flex flex-wrap gap-1.5"
              >
                {EXPERIENCE.map(({ label, Icon }, i) => (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={exp === label}
                    data-autofocus={i === 1 ? "" : undefined}
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
          )}

          {step === 1 && (
            <div>
              <p className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-700">
                <MapPin className="h-4 w-4 text-zinc-400" />
                Where should they be based?
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PLACES.map((option, i) => (
                  <button
                    key={option}
                    type="button"
                    data-autofocus={i === 1 ? "" : undefined}
                    aria-pressed={selectedPlace === option}
                    onClick={() => setPlace(option === "Anywhere in India" ? "" : option)}
                    className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      selectedPlace === option
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <label
                htmlFor="refine-location"
                className="mt-3 block text-[12px] text-zinc-500"
              >
                Or type a city
              </label>
              <input
                id="refine-location"
                value={place === "Anywhere in India" ? "" : place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Coimbatore"
                className="mt-1.5 h-10 w-full rounded-full border border-zinc-200 bg-white px-4 text-sm outline-none transition-all placeholder:text-zinc-500 focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label
                htmlFor="refine-notes"
                className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-700"
              >
                <NotePencil className="h-4 w-4 text-zinc-400" />
                Anything else we should know?
              </label>
              <p className="mt-1.5 text-[12px] text-zinc-500">
                Mention skills or constraints. We read them too, so
                &ldquo;fintech, 5+ years&rdquo; filters for you.
              </p>
              <textarea
                id="refine-notes"
                data-autofocus=""
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fintech background, 5+ years, can start in a month"
                className="mt-3 w-full resize-none rounded-[20px] border border-zinc-200 bg-white px-3.5 py-3 text-sm leading-6 outline-none transition-all placeholder:text-zinc-500 focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3.5 py-1.5 text-[13px] font-medium text-zinc-700 transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-[13px] font-medium text-zinc-700 transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              last ? onSubmit(exp, place.trim(), notes.trim()) : setStep(step + 1)
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {last ? "Search" : "Next"}
            {last ? (
              <Check weight="bold" className="h-3.5 w-3.5" />
            ) : (
              <ArrowRight weight="bold" className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
