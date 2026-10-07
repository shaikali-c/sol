"use client";

export type Candidate = {
  name: string;
  role: string;
  years: number;
  location: string;
  match: number;
  skills: string;
};

// mock data: no ranking backend yet
export const CANDIDATES: Candidate[] = [
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

const KEY = "sol-saved";
const EVENT = "sol-saved-changed";

let cache: string[] | null = null;

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

const EMPTY: string[] = [];

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
