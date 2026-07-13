"use client";

import { useEffect, useState } from "react";
import { TypewriterLine } from "./TypewriterLine";
import { useLetterDelete, useLetterReveal } from "./useLetterReveal";

export type PhrasePhase =
  | "in"
  | "idle"
  | "shift"
  | "tagline-1-in"
  | "tagline-1-pause"
  | "tagline-2-in"
  | "shift-2"
  | "coda-in"
  | "coda-idle"
  | "coda-out"
  | "tagline-out"
  | "out";

const PAREN_HOLD_PHASES: PhrasePhase[] = [
  "shift",
  "tagline-1-in",
  "tagline-1-pause",
  "tagline-2-in",
  "shift-2",
  "coda-in",
  "coda-idle",
  "coda-out",
  "tagline-out",
];

export function getPhraseTiming(
  length: number,
  letterStaggerMs: number,
  letterDurationMs: number,
  delayMs = 0,
) {
  return (
    delayMs + (Math.max(length, 1) - 1) * letterStaggerMs + letterDurationMs
  );
}

export function getTypingDuration(
  length: number,
  letterStaggerMs: number,
  delayMs = 0,
) {
  return delayMs + length * letterStaggerMs + letterStaggerMs;
}

export function getOutTiming(
  length: number,
  letterStaggerMs: number,
  letterDurationMs: number,
) {
  return length * letterStaggerMs + letterDurationMs;
}

export function BracketedTypewriter({
  phrase,
  phase,
  delayMs = 0,
  letterStaggerMs,
  showCursor = false,
  typePhases = ["in"],
  holdPhases = PAREN_HOLD_PHASES,
  deletePhases = ["out"],
}: {
  phrase: string;
  phase: PhrasePhase;
  delayMs?: number;
  letterStaggerMs: number;
  showCursor?: boolean;
  typePhases?: readonly PhrasePhase[];
  holdPhases?: readonly PhrasePhase[];
  deletePhases?: readonly PhrasePhase[];
}) {
  const length = phrase.length;
  const isTypePhase = typePhases.includes(phase);
  const [revealed, setRevealed] = useState(!isTypePhase);
  const [heldCount, setHeldCount] = useState(isTypePhase ? 0 : length);

  const typing = isTypePhase && revealed;
  const deleting = deletePhases.includes(phase);
  const typedCount = useLetterReveal(length, typing, letterStaggerMs);
  const deletedCount = useLetterDelete(length, deleting, letterStaggerMs);

  useEffect(() => {
    if (!isTypePhase) {
      setRevealed(true);
      return;
    }

    setRevealed(false);
    if (delayMs <= 0) {
      setRevealed(true);
      return;
    }

    const timeout = window.setTimeout(() => setRevealed(true), delayMs);
    return () => window.clearTimeout(timeout);
  }, [phase, delayMs, isTypePhase]);

  useEffect(() => {
    if (phase === "idle" || holdPhases.includes(phase)) {
      setHeldCount(length);
      return;
    }

    if (isTypePhase || deletePhases.includes(phase)) {
      setHeldCount(0);
    }
  }, [phase, length, holdPhases, deletePhases, isTypePhase]);

  const visibleCount = deleting
    ? deletedCount
    : heldCount > 0
      ? heldCount
      : typedCount;

  const visibleText = revealed ? phrase.slice(0, visibleCount) : "";

  return (
    <TypewriterLine
      showCursor={showCursor && revealed}
      className={`font-mono text-[0.78em] text-muted md:text-[0.84em] ${
        revealed ? "" : "invisible"
      }`}
      aria-hidden={!revealed}
    >
      <span>(</span>
      {visibleText}
      <span>)</span>
    </TypewriterLine>
  );
}
