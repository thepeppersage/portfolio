"use client";

import type { ReactNode } from "react";

export function TypewriterCursor() {
  return (
    <span
      aria-hidden
      className="ml-[0.08em] inline-block h-[0.82em] w-[0.08em] shrink-0 animate-cursor-blink bg-foreground align-middle"
    />
  );
}

export function TypewriterLine({
  children,
  showCursor = false,
  className = "",
}: {
  children: ReactNode;
  showCursor?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`block max-w-full leading-[1.08] tracking-tight ${className}`}
      aria-live="polite"
    >
      {children}
      {showCursor ? <TypewriterCursor /> : null}
    </span>
  );
}
