"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const LINKS = [
  { href: "/dashboard", label: "Ideas" },
  { href: "/calendar", label: "Calendar" },
  { href: "/journal", label: "Journal" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/dashboard" className="text-xl font-semibold tracking-tight">
          <span className="text-ember">Ember</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active =
              l.href === "/dashboard"
                ? path === "/dashboard"
                : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-surface-raised text-text"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="ml-2">
            <UserButton
              appearance={{ elements: { avatarBox: "w-8 h-8" } }}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
