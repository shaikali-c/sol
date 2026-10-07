"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  BookmarkSimple,
  CaretDown,
  EnvelopeSimple,
  MapPin,
  Phone,
  Sun,
  Trash,
} from "@phosphor-icons/react";
import {
  ALL_CANDIDATES,
  getSaved,
  getSavedServer,
  subscribeSaved,
  toggleSaved,
  type Candidate,
} from "../data";

const PURPOSES = {
  call: [
    "Discuss the opportunity",
    "Ask about current CTC",
    "Ask about notice period",
    "Check availability",
    "Schedule interview",
    "Follow up",
    "Other",
  ],
  email: [
    "Send invite",
    "Ask them to reach out",
    "Ask about current CTC",
    "Ask about notice period",
    "Ask about availability",
    "Follow up",
    "Custom message",
  ],
} as const;

function ContactMenu({
  kind,
  target,
  onPick,
}: {
  kind: "call" | "email";
  target: string;
  onPick: (purpose: string) => void;
}) {
  return (
    <div
      role="menu"
      aria-label={kind === "call" ? "Call purpose" : "Email purpose"}
      className="absolute bottom-full left-0 z-30 mb-2 w-60 overflow-hidden rounded-[20px] border border-zinc-200 bg-white p-1 shadow-[0_8px_28px_rgba(0,0,0,0.10)]"
    >
      <p className="truncate px-3 pb-1.5 pt-1.5 text-[12px] text-zinc-500">
        {target}
      </p>
      {PURPOSES[kind].map((purpose) => (
        <button
          key={purpose}
          role="menuitem"
          onClick={() => onPick(purpose)}
          className="block w-full rounded-lg px-3 py-1.5 text-left text-[13px] text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:bg-zinc-50 focus-visible:outline-none"
        >
          {purpose}
        </button>
      ))}
    </div>
  );
}

function ConfirmRemove({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const confirm = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirm.current?.focus();
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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-remove-title"
        aria-describedby="confirm-remove-body"
        className="relative w-full max-w-sm rounded-[20px] border border-zinc-200 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
          <Trash className="h-5 w-5 text-zinc-700" />
        </div>
        <h2
          id="confirm-remove-title"
          className="mt-4 font-display text-[17px] font-semibold tracking-[-0.01em]"
        >
          Remove from saved?
        </h2>
        <p id="confirm-remove-body" className="mt-1.5 text-sm leading-6 text-zinc-500">
          {name} will be dropped from your shortlist. You can always find them
          again in search results.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-[13px] font-medium text-zinc-700 transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Cancel
          </button>
          <button
            ref={confirm}
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-600 px-3.5 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomMessageDialog({
  name,
  onCancel,
  onSend,
}: {
  name: string;
  onCancel: () => void;
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    area.current?.focus();
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
        aria-labelledby="custom-message-title"
        className="relative w-full max-w-md rounded-[20px] border border-zinc-200 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
          <EnvelopeSimple className="h-5 w-5 text-zinc-700" />
        </div>
        <h2
          id="custom-message-title"
          className="mt-4 font-display text-[17px] font-semibold tracking-[-0.01em]"
        >
          Message {name}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-zinc-500">
          Write the message you want to send. Nothing is sent yet.
        </p>
        <textarea
          ref={area}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Hi, we came across your profile and would like to talk about…"
          className="mt-4 w-full resize-none rounded-[20px] border border-zinc-200 bg-white px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none transition-all placeholder:text-zinc-500 focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
        />
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-[13px] font-medium text-zinc-700 transition-all hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!message.trim()}
            onClick={() => onSend(message.trim())}
            className="rounded-full bg-blue-600 px-3.5 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send message
          </button>
        </div>
      </div>
    </div>
  );
}

function SavedCard({
  candidate: c,
  onRemove,
}: {
  candidate: Candidate;
  onRemove: (name: string) => void;
}) {
  const [menu, setMenu] = useState<"call" | "email" | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const actions = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent
          ? e.key === "Escape"
          : actions.current && !actions.current.contains(e.target as Node)
      ) {
        setMenu(null);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menu]);

  return (
    <li className="h-full">
      <article className="relative flex h-full flex-col rounded-[20px] border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-semibold tracking-tight">
            {c.name}
          </h2>
          <p className="truncate text-sm text-zinc-500">{c.role}</p>
        </div>

        <div className="mt-3 border-t border-zinc-100 pt-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-sm text-zinc-700">
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
                {c.location}
              </p>
              <p className="mt-0.5 truncate text-sm text-zinc-500">
                {c.years} years experience
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div
                role="img"
                aria-label={`${c.match}% match`}
                className="relative flex h-10 w-10 items-center justify-center"
              >
                <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.5" className="stroke-zinc-100" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.5" strokeLinecap="round"
                    className={c.match >= 90 ? "stroke-blue-600" : "stroke-zinc-900"}
                    strokeDasharray={`${2 * Math.PI * 15.5}`}
                    strokeDashoffset={2 * Math.PI * 15.5 * (1 - c.match / 100)}
                  />
                </svg>
                <span className="text-[10px] font-semibold tabular-nums tracking-tight text-zinc-900">
                  {c.match}
                  <span className="text-zinc-500">%</span>
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">match</span>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {c.phone && (
            <p className="flex items-center gap-1.5 text-sm text-zinc-600">
              <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="truncate tabular-nums">{c.phone}</span>
            </p>
          )}
          {c.email && (
            <p className="flex items-center gap-1.5 text-sm text-zinc-600">
              <EnvelopeSimple className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="truncate">{c.email}</span>
            </p>
          )}
          {!c.phone && !c.email && (
            <p className="text-sm text-zinc-500">Contact details on request</p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.skills.split(", ").map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[12px] text-zinc-600"
            >
              {skill}
            </span>
          ))}
        </div>

        <div ref={actions} className="mt-auto flex items-center gap-2 pt-4">
          {(["call", "email"] as const).map((kind) => {
            const open = menu === kind;
            const Icon = kind === "call" ? Phone : EnvelopeSimple;
            return (
              <div key={kind} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  onClick={() => setMenu(open ? null : kind)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    open
                      ? "border-zinc-900 bg-zinc-50 text-zinc-900"
                      : "border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
                  }`}
                >
                  <Icon weight="bold" className="h-3.5 w-3.5" />
                  {kind === "call" ? "Call" : "Email"}
                  <CaretDown
                    className={`h-2.5 w-2.5 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <ContactMenu
                    kind={kind}
                    target={
                      kind === "call"
                        ? c.phone ?? "No number on file"
                        : c.email ?? "No email on file"
                    }
                    onPick={(purpose) => {
                      setMenu(null);
                      if (purpose === "Custom message") setCustomOpen(true);
                    }}
                  />
                )}
              </div>
            );
          })}

          <button
            type="button"
            aria-label={`Remove ${c.name} from saved`}
            title="Remove from saved"
            onClick={() => onRemove(c.name)}
            className="ml-auto rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </article>

      {customOpen && (
        <CustomMessageDialog
          name={c.name}
          onCancel={() => setCustomOpen(false)}
          onSend={() => setCustomOpen(false)}
        />
      )}
    </li>
  );
}

export default function SavedPage() {
  const saved = useSyncExternalStore(subscribeSaved, getSaved, getSavedServer);
  const [removing, setRemoving] = useState<string | null>(null);
  const profiles = ALL_CANDIDATES.filter((c) => saved.includes(c.name));

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
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em]">
            Saved profiles
          </h1>
          <p className="text-sm tabular-nums text-zinc-500">{profiles.length} saved</p>
        </div>

        {profiles.length > 0 ? (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {profiles.map((c) => (
              <SavedCard
                key={c.name}
                candidate={c}
                onRemove={setRemoving}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[20px] border border-zinc-200 px-6 py-14 text-center">
            <BookmarkSimple className="mx-auto h-6 w-6 text-zinc-400" />
            <p className="mt-3 text-sm text-zinc-500">
              No saved profiles yet. Open search results and tap the bookmark on
              a card.
            </p>
            <Link
              href="/results"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Search candidates
              <ArrowRight weight="bold" className="h-4 w-4" />
            </Link>
          </div>
        )}
      </main>

      {removing && (
        <ConfirmRemove
          name={removing}
          onCancel={() => setRemoving(null)}
          onConfirm={() => {
            toggleSaved(removing);
            setRemoving(null);
          }}
        />
      )}
    </div>
  );
}
