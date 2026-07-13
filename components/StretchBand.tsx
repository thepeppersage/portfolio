"use client";

import { useEffect, useRef } from "react";
import { BACKGROUND_LAG_SPEED } from "@/lib/parallax";
import {
  SECTION_BG_BLACK,
  SECTION_BG_GRAY,
} from "@/lib/section-shell";
import { useParallaxDebug } from "./ParallaxDebug";

type StretchBandProps = {
  after: string;
  below: "work" | "about";
};

const STRETCH_MAX_PX = 150;

/**
 * Strip between sections. Every band uses the same exit-based growth:
 * as the section above leaves the viewport, height = exitPx × bg-lag speed,
 * capped at 150px. Grows UP via negative margin.
 */
export function StretchBand({ after, below }: StretchBandProps) {
  const debug = useParallaxDebug();
  const ref = useRef<HTMLDivElement>(null);
  const productionFill = below === "work" ? SECTION_BG_BLACK : SECTION_BG_GRAY;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const prev = document.getElementById(after);
      if (!prev) {
        el.style.height = "0px";
        el.style.marginTop = "0px";
        return;
      }

      const vh = window.innerHeight;
      const prevBottom = prev.getBoundingClientRect().bottom;
      // Identical for every band: how far the section above has left the viewport.
      const exitPx = Math.min(vh, Math.max(0, vh - prevBottom));
      const height = Math.min(STRETCH_MAX_PX, exitPx * BACKGROUND_LAG_SPEED);

      el.style.height = `${height}px`;
      el.style.marginTop = `${-height}px`;
      if (debug) {
        el.style.backgroundColor = "#d946ef";
      } else {
        el.style.backgroundColor = "";
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [after, debug]);

  return (
    <div
      ref={ref}
      data-stretch-band
      data-stretch-after={after}
      aria-hidden
      className={`relative z-10 w-full shrink-0 ${debug ? "" : productionFill}`}
      style={{
        height: 0,
        marginTop: 0,
        backgroundColor: debug ? "#d946ef" : undefined,
      }}
    >
      {debug ? (
        <span className="pointer-events-none absolute left-2 top-1 whitespace-nowrap rounded bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
          {below === "work"
            ? "FUCHSIA stretch §1 → §2"
            : "FUCHSIA stretch §2 → §3"}
        </span>
      ) : null}
    </div>
  );
}
