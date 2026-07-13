"use client";

import { useEffect, useMemo, useState } from "react";
import { type PhrasePhase } from "./BracketedTypewriter";
import { TypewriterCursor, TypewriterLine } from "./TypewriterLine";
import { useLetterDelete, useLetterReveal } from "./useLetterReveal";

export const TAGLINE_PHASES: PhrasePhase[] = [
  "tagline-1-in",
  "tagline-1-pause",
  "tagline-2-in",
  "shift-2",
  "coda-in",
  "coda-idle",
  "coda-out",
  "tagline-out",
];

const CURSOR_PHASES: PhrasePhase[] = [
  "tagline-1-in",
  "tagline-1-pause",
  "tagline-2-in",
  "tagline-out",
];

export function PlainTypewriter({
  segments,
  phase,
  letterStaggerMs,
  tailLetterStaggerMs,
}: {
  segments: readonly string[];
  phase: PhrasePhase;
  letterStaggerMs: number;
  /** Slower stagger for the final segment (e.g. “good questions”). */
  tailLetterStaggerMs?: number;
}) {
  const fullText = useMemo(() => segments.join(""), [segments]);
  const seg1End = segments[0]?.length ?? 0;
  const fullLen = fullText.length;
  const isActive = TAGLINE_PHASES.includes(phase);
  const [heldCount, setHeldCount] = useState(0);
  const seg2Stagger = tailLetterStaggerMs ?? letterStaggerMs;

  const seg1Typing = phase === "tagline-1-in";
  const seg2Typing = phase === "tagline-2-in";
  const deleting = phase === "tagline-out";

  const seg1Typed = useLetterReveal(seg1End, seg1Typing, letterStaggerMs);
  const seg2Typed = useLetterReveal(
    fullLen - seg1End,
    seg2Typing,
    seg2Stagger,
  );
  const deletedCount = useLetterDelete(fullLen, deleting, letterStaggerMs);

  useEffect(() => {
    if (!isActive) {
      setHeldCount(0);
      return;
    }

    if (phase === "tagline-1-pause") {
      setHeldCount(seg1End);
      return;
    }

    if (
      phase === "shift-2" ||
      phase === "coda-in" ||
      phase === "coda-idle" ||
      phase === "coda-out"
    ) {
      setHeldCount(fullLen);
      return;
    }

    if (
      phase === "tagline-1-in" ||
      phase === "tagline-2-in" ||
      phase === "tagline-out"
    ) {
      setHeldCount(0);
    }
  }, [phase, fullLen, seg1End, isActive]);

  const visibleCount = deleting
    ? deletedCount
    : heldCount > 0
      ? heldCount
      : seg2Typing
        ? seg1End + seg2Typed
        : seg1Typed;

  const showCursor = CURSOR_PHASES.includes(phase);

  if (!isActive) return null;

  let offset = 0;
  let lastVisibleIndex = -1;
  for (let i = 0; i < segments.length; i++) {
    const start = offset;
    offset += segments[i].length;
    if (visibleCount > start) lastVisibleIndex = i;
  }

  offset = 0;

  return (
    <TypewriterLine>
      {segments.map((segment, index) => {
        const start = offset;
        offset += segment.length;
        if (visibleCount <= start) return null;

        const chunk = segment.slice(0, visibleCount - start);
        const isCursorLine = showCursor && index === lastVisibleIndex;

        return (
          <span
            key={segment}
            className={
              index === segments.length - 1 ? "inline !font-bold" : "inline"
            }
          >
            {chunk}
            {isCursorLine ? <TypewriterCursor /> : null}
          </span>
        );
      })}
      {showCursor && lastVisibleIndex < 0 ? <TypewriterCursor /> : null}
    </TypewriterLine>
  );
}
