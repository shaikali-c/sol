import {
  baseMatches,
  matchScraped,
  parseNotes,
  tokenize,
} from "../app/data";

const names = (q: string, exp?: string, loc?: string, notes?: string) =>
  matchScraped(q, exp, loc, notes).results.map((r) => r.candidate.name);

const outcome = (q: string, exp?: string, loc?: string, notes?: string) =>
  matchScraped(q, exp, loc, notes);

console.assert(tokenize("C++").includes("c++"), "c++ must survive tokenizing");
console.assert(
  names("c++")[0] === "Rahul Deshpande",
  `c++ should rank the C++ engineer first, got ${names("c++")[0]}`
);
console.assert(names("c++").length === 3, `expected 3 C++ hits, got ${names("c++").length}`);
console.assert(
  names("golang").includes("Ravi Teja"),
  "golang alias should reach the Go engineer"
);
console.assert(
  names("reactjs").includes("Neha Kulkarni"),
  "reactjs alias should reach the React engineers"
);
console.assert(names("react").length >= 5, "react should hit the React pool");
console.assert(
  names("react", "Lead").every((n) => n !== "Ishita Bansal"),
  "Lead band should drop the 4-year candidate"
);
console.assert(names("cooking classes in paris").length === 0, "no hits for nonsense");
console.assert(
  names("engineer", "Any", "Pune").includes("Sanjay Kulkarni"),
  "a named city should surface its candidates"
);
console.assert(
  names("developer", "Any", "Bengaluru").every((n) =>
    ["Rahul Deshpande", "Rohan Verma", "Aarav Bhatia"].includes(n)
  ),
  "a named city should exclude everyone else"
);
console.assert(names("engineers").length >= 5, "plural query should match the role");
console.assert(
  names("react", "Any", "India").length === names("react").length,
  "India should not act as a location filter"
);
console.assert(
  names("", "", "Pune").length === 0,
  "an empty query must not match on location alone"
);
console.assert(
  names("react", "Any", "", "fintech").length <= names("react").length,
  "notes cannot invent candidates"
);
console.assert(
  names("react", "", "", "10+ years").every(
    (n) => !["Ishita Bansal", "Manish Gupta"].includes(n)
  ),
  "a 10+ year note should exclude the junior candidates"
);
console.assert(parseNotes("5+ years, fintech background").minYears === 5, "years parsed");
console.assert(baseMatches().length === 18, "base fetch covers the pool");
console.assert(
  names("react developer").includes("Aarav Bhatia"),
  "a developer query should reach the intern"
);
console.assert(
  !names("senior react developer, remote").some((n) => n === "Aditi Sharma"),
  "a Java backend must not answer a React query"
);
console.assert(
  names("intern").every((n) => ["Aarav Bhatia", "Saanvi Kapoor"].includes(n)),
  "intern must not return experienced candidates"
);
console.assert(
  names("remote react").every((n) =>
    ["Neha Kulkarni", "Rohan Verma", "Aarav Bhatia"].includes(n)
  ),
  "remote should only keep candidates open to it"
);
console.assert(names("aws").includes("Ravi Teja"), "short tokens must be indexed");

console.assert(
  outcome("python", "Any", "", "8+ years").beforeRequirements > 0 &&
    outcome("python", "Any", "", "8+ years").results.length === 0,
  "requirements that rule everything out must not fall back to the base list"
);

console.log("matcher checks passed");
