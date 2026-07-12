import { ReactNode } from "react";

// Centered auth layout with the Ember wordmark over the dark canvas.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          <span className="text-ember">Ember</span>
        </h1>
        <p className="mt-2 text-text-muted max-w-xs">
          Tend the things you&apos;re building in your life. Watch them burn.
        </p>
      </div>
      {children}
    </main>
  );
}
