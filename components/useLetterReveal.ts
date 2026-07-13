"use client";

import { useEffect, useState } from "react";

export function useLetterReveal(
  length: number,
  active: boolean,
  letterStaggerMs: number,
) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active || length === 0) return;

    setVisibleCount(0);
    const timeouts = Array.from({ length }, (_, i) =>
      window.setTimeout(
        () => setVisibleCount(i + 1),
        (i + 1) * letterStaggerMs,
      ),
    );

    return () => timeouts.forEach(window.clearTimeout);
  }, [active, length, letterStaggerMs]);

  return visibleCount;
}

export function useLetterDelete(
  length: number,
  active: boolean,
  letterStaggerMs: number,
) {
  const [visibleCount, setVisibleCount] = useState(length);

  useEffect(() => {
    if (!active) {
      setVisibleCount(length);
      return;
    }

    if (length === 0) return;

    setVisibleCount(length);
    const timeouts = Array.from({ length }, (_, i) =>
      window.setTimeout(
        () => setVisibleCount(length - 1 - i),
        (i + 1) * letterStaggerMs,
      ),
    );

    return () => timeouts.forEach(window.clearTimeout);
  }, [active, length, letterStaggerMs]);

  return visibleCount;
}
