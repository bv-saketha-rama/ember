"use client";

import { ReactNode } from "react";
import { Nav } from "./Nav";

export function MainShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        {children}
      </main>
    </div>
  );
}
