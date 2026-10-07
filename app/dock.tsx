"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkSimple, House, MagnifyingGlass } from "@phosphor-icons/react";

const ITEMS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/results", label: "Search", Icon: MagnifyingGlass },
  { href: "/saved", label: "Saved", Icon: BookmarkSimple },
];

export default function Dock() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-zinc-200 bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-blue-600 ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Icon weight={active ? "fill" : "regular"} className="h-[18px] w-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
