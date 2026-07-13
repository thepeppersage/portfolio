"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/lib/data";
import { scrollToSection } from "@/lib/scroll-to-section";
import {
  SECTION_BG_CLASS,
  SECTION_BG_GRAY,
  SECTION_BODY_CLASS,
  SECTION_CLASS,
  SECTION_INNER_CLASS,
} from "@/lib/section-shell";
import { useParallaxDebug, DebugLabel } from "./ParallaxDebug";
import {
  BracketedTypewriter,
  getOutTiming,
  getPhraseTiming,
  getTypingDuration,
  type PhrasePhase,
} from "./BracketedTypewriter";
import { PlainTypewriter, TAGLINE_PHASES } from "./PlainTypewriter";

const HERO_PHRASE_DELAY_MS = 750;
const HERO_LETTER_STAGGER_MS = 72;
const HERO_TAGLINE_TAIL_STAGGER_MS = 128;
const HERO_LETTER_DURATION_MS = 520;
const HERO_IDLE_MS = 2900;
const TAGLINE_PAUSE_MS = 1000;
const LINE_SHIFT_MS = 750;

const CODA_PHASES: PhrasePhase[] = ["coda-in", "coda-idle", "coda-out"];

type HeroLayout = {
  gap: number;
  shiftPx1: number;
  shiftPx2: number;
  preShiftViewport: number;
  withTaglineViewport: number;
  taglineHeight: number;
};

const EMPTY_LAYOUT: HeroLayout = {
  gap: 0,
  shiftPx1: 0,
  shiftPx2: 0,
  preShiftViewport: 0,
  withTaglineViewport: 0,
  taglineHeight: 0,
};

export function Hero() {
  const [phase, setPhase] = useState<PhrasePhase>("in");
  const [shiftStage, setShiftStage] = useState(0);
  const [skipLineTransition, setSkipLineTransition] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const taglineMeasureRef = useRef<HTMLSpanElement>(null);
  const layoutRef = useRef<HeroLayout>(EMPTY_LAYOUT);
  const [shiftPx1, setShiftPx1] = useState(0);
  const [shiftPx2, setShiftPx2] = useState(0);
  const [viewportPx, setViewportPx] = useState(0);
  const [taglineSlotHeight, setTaglineSlotHeight] = useState(0);
  const phrase = site.heroPhrase;
  const coda = site.heroCoda;
  const segments = site.heroTaglineSegments;
  const fullTagline = segments.join("");
  const showTagline = TAGLINE_PHASES.includes(phase);
  const showTaglineSlot = phase === "shift" || showTagline;
  const showCoda = CODA_PHASES.includes(phase);

  const postShiftViewport = useCallback((layout: HeroLayout) => {
    return Math.max(layout.preShiftViewport, layout.withTaglineViewport);
  }, []);

  const translateY =
    shiftStage >= 2
      ? shiftPx1 + shiftPx2
      : shiftStage >= 1
        ? shiftPx1
        : 0;

  const recalculateLayout = useCallback(() => {
    const track = trackRef.current;
    const taglineMeasure = taglineMeasureRef.current;
    if (!track || !taglineMeasure) return layoutRef.current;

    const lead = track.children[0] as HTMLElement | undefined;
    const paren = track.children[1] as HTMLElement | undefined;
    if (!lead || !paren) return layoutRef.current;

    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.rowGap || styles.gap || "0") || 0;
    const leadHeight = lead.getBoundingClientRect().height;
    const parenHeight = paren.getBoundingClientRect().height;
    const taglineHeight = taglineMeasure.getBoundingClientRect().height;
    const preShiftViewport = leadHeight + gap + parenHeight + 2;
    const withTaglineViewport = parenHeight + gap + taglineHeight + 2;

    layoutRef.current = {
      gap,
      shiftPx1: leadHeight + gap,
      shiftPx2: parenHeight + gap,
      preShiftViewport,
      withTaglineViewport,
      taglineHeight,
    };

    setTaglineSlotHeight(taglineHeight);
    return layoutRef.current;
  }, []);

  const applyViewportForPhase = useCallback(
    (nextPhase: PhrasePhase, nextShiftStage: number) => {
      const layout = recalculateLayout();

      setShiftPx1(layout.shiftPx1);
      setShiftPx2(layout.shiftPx2);

      if (nextPhase === "shift") {
        setViewportPx(postShiftViewport(layout));
        return;
      }

      if (TAGLINE_PHASES.includes(nextPhase) || nextShiftStage >= 1) {
        setViewportPx(postShiftViewport(layout));
        return;
      }

      setViewportPx(layout.preShiftViewport);
    },
    [recalculateLayout, postShiftViewport],
  );

  useLayoutEffect(() => {
    applyViewportForPhase(phase, shiftStage);
  }, [phase, shiftStage, applyViewportForPhase]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => {
      applyViewportForPhase(phase, shiftStage);
    });

    observer.observe(track);
    for (const child of track.children) {
      observer.observe(child);
    }

    return () => observer.disconnect();
  }, [phase, shiftStage, applyViewportForPhase]);

  useEffect(() => {
    const onResize = () => applyViewportForPhase(phase, shiftStage);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase, shiftStage, applyViewportForPhase]);

  useEffect(() => {
    if (phase !== "in") return;

    setSkipLineTransition(true);
    setShiftStage(0);
    const frame = window.requestAnimationFrame(() => {
      setSkipLineTransition(false);
    });

    const timeout = window.setTimeout(() => {
      setPhase("idle");
    }, getTypingDuration(
      phrase.length,
      HERO_LETTER_STAGGER_MS,
      HERO_PHRASE_DELAY_MS,
    ));

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [phase, phrase]);

  useEffect(() => {
    if (phase !== "idle") return;

    const timeout = window.setTimeout(() => {
      setPhase("shift");
    }, HERO_IDLE_MS);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "shift") return;

    setSkipLineTransition(false);

    let shiftFrame = 0;
    const startFrame = window.requestAnimationFrame(() => {
      shiftFrame = window.requestAnimationFrame(() => {
        setShiftStage(1);
      });
    });

    const timeout = window.setTimeout(() => {
      setPhase("tagline-1-in");
    }, LINE_SHIFT_MS);

    return () => {
      window.cancelAnimationFrame(startFrame);
      window.cancelAnimationFrame(shiftFrame);
      window.clearTimeout(timeout);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "tagline-1-in") return;

    const timeout = window.setTimeout(() => {
      setPhase("tagline-1-pause");
    }, getPhraseTiming(
      segments[0].length,
      HERO_LETTER_STAGGER_MS,
      HERO_LETTER_DURATION_MS,
    ));

    return () => window.clearTimeout(timeout);
  }, [phase, segments]);

  useEffect(() => {
    if (phase !== "tagline-1-pause") return;

    const timeout = window.setTimeout(() => {
      setPhase("tagline-2-in");
    }, TAGLINE_PAUSE_MS);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "tagline-2-in") return;

    const timeout = window.setTimeout(() => {
      setPhase("shift-2");
    }, getPhraseTiming(
      segments[1].length,
      HERO_TAGLINE_TAIL_STAGGER_MS,
      HERO_LETTER_DURATION_MS,
    ));

    return () => window.clearTimeout(timeout);
  }, [phase, segments]);

  useEffect(() => {
    if (phase !== "shift-2") return;

    setSkipLineTransition(false);

    let shiftFrame = 0;
    const startFrame = window.requestAnimationFrame(() => {
      shiftFrame = window.requestAnimationFrame(() => {
        setShiftStage(2);
      });
    });

    const timeout = window.setTimeout(() => {
      setPhase("coda-in");
    }, LINE_SHIFT_MS);

    return () => {
      window.cancelAnimationFrame(startFrame);
      window.cancelAnimationFrame(shiftFrame);
      window.clearTimeout(timeout);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "coda-in") return;

    const timeout = window.setTimeout(() => {
      setPhase("coda-idle");
    }, getTypingDuration(coda.length, HERO_LETTER_STAGGER_MS));

    return () => window.clearTimeout(timeout);
  }, [phase, coda]);

  useEffect(() => {
    if (phase !== "coda-idle") return;

    const timeout = window.setTimeout(() => {
      setPhase("coda-out");
    }, HERO_IDLE_MS);

    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "coda-out") return;

    const timeout = window.setTimeout(() => {
      setPhase("tagline-out");
    }, getOutTiming(coda.length, HERO_LETTER_STAGGER_MS, HERO_LETTER_DURATION_MS));

    return () => window.clearTimeout(timeout);
  }, [phase, coda]);

  useEffect(() => {
    if (phase !== "tagline-out") return;

    const timeout = window.setTimeout(() => {
      setPhase("out");
    }, getOutTiming(
      fullTagline.length,
      HERO_LETTER_STAGGER_MS,
      HERO_LETTER_DURATION_MS,
    ));

    return () => window.clearTimeout(timeout);
  }, [phase, fullTagline]);

  useEffect(() => {
    if (phase !== "out") return;

    const timeout = window.setTimeout(() => {
      setPhase("in");
    }, getOutTiming(phrase.length, HERO_LETTER_STAGGER_MS, HERO_LETTER_DURATION_MS));

    return () => window.clearTimeout(timeout);
  }, [phase, phrase]);

  const scrollHintRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const FADE_DISTANCE = 180;
    let raf = 0;

    const update = () => {
      raf = 0;
      const hint = scrollHintRef.current;
      if (!hint) return;

      const opacity = Math.max(0, 1 - window.scrollY / FADE_DISTANCE);
      hint.style.opacity = String(opacity);
      hint.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
      hint.setAttribute("aria-hidden", opacity < 0.05 ? "true" : "false");
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToWork = () => {
    scrollToSection("work");
  };

  const debug = useParallaxDebug();

  return (
    // Section 1: background + content. On scroll, content exits faster than the bg.
    <section
      id="hero"
      data-section-parallax
      className={
        debug
          ? `${SECTION_CLASS} ${SECTION_BG_GRAY} bg-cyan-300 outline outline-4 outline-cyan-100`
          : `${SECTION_CLASS} ${SECTION_BG_GRAY}`
      }
    >
      {/* Background — lags behind (stays on screen longer) */}
      <div
        data-section-bg
        aria-hidden
        className={
          debug
            ? `${SECTION_BG_CLASS} bg-cyan-300`
            : `${SECTION_BG_CLASS} ${SECTION_BG_GRAY}`
        }
      >
        <DebugLabel>§1 bg (lags)</DebugLabel>
      </div>
      {/* Content — moves off the page faster than the background */}
      <div
        data-section-body
        className={SECTION_BODY_CLASS}
      >
        <DebugLabel corner="tr">§1 content (exits faster)</DebugLabel>
        <div
          className={
            debug
              ? `${SECTION_INNER_CLASS} bg-cyan-200/80`
              : SECTION_INNER_CLASS
          }
        >
          <h1 className="relative max-w-5xl font-light leading-[1.08] tracking-tight animate-fade-up">
          <span
            ref={taglineMeasureRef}
            aria-hidden
            className="pointer-events-none invisible absolute inset-x-0 top-0 block max-w-full text-[clamp(3rem,9.2vw,5.65rem)] leading-[1.08] tracking-tight"
          >
            {segments.map((segment, index) => (
              <span
                key={segment}
                className={
                  index === segments.length - 1 ? "inline !font-bold" : "inline"
                }
              >
                {segment}
              </span>
            ))}
            <span className="mt-2 block font-mono text-[clamp(2.25rem,7vw,5.5rem)] md:mt-3">
              <span className="text-[0.78em] md:text-[0.84em]">({coda})</span>
            </span>
          </span>
          <div
            className="overflow-visible"
            style={
              viewportPx
                ? {
                    height: viewportPx,
                    clipPath: "inset(0 -100vw 0 -100vw)",
                  }
                : undefined
            }
          >
            <div
              ref={trackRef}
              className="flex flex-col gap-2 md:gap-3"
              style={{
                transform:
                  translateY > 0
                    ? `translate3d(0, -${translateY}px, 0)`
                    : "translate3d(0, 0, 0)",
                transition: skipLineTransition
                  ? "none"
                  : `transform ${LINE_SHIFT_MS}ms cubic-bezier(0.35, 0, 0.15, 1)`,
                willChange:
                  phase === "shift" || phase === "shift-2" || skipLineTransition
                    ? "transform"
                    : "auto",
              }}
            >
              <span className="block max-w-full shrink-0 text-[clamp(3.45rem,11vw,5.75rem)]">
                {site.heroLead}
              </span>
              <span className="block max-w-full shrink-0 text-[clamp(2.25rem,7vw,5.5rem)]">
                <BracketedTypewriter
                  phrase={phrase}
                  phase={phase}
                  delayMs={HERO_PHRASE_DELAY_MS}
                  showCursor={phase === "in" || phase === "idle"}
                  letterStaggerMs={HERO_LETTER_STAGGER_MS}
                />
              </span>
              {showTaglineSlot ? (
                <span
                  className="relative flex max-w-full shrink-0 flex-col gap-2 text-[clamp(3rem,9.2vw,5.65rem)] md:gap-3"
                  style={
                    taglineSlotHeight
                      ? { minHeight: taglineSlotHeight }
                      : undefined
                  }
                >
                  <span aria-hidden className="invisible block leading-[1.08] tracking-tight">
                    {segments.map((segment, index) => (
                      <span
                        key={segment}
                        className={
                          index === segments.length - 1
                            ? "inline !font-bold"
                            : "inline"
                        }
                      >
                        {segment}
                      </span>
                    ))}
                    <span className="mt-2 block font-mono text-[clamp(2.25rem,7vw,5.5rem)] md:mt-3">
                      <span className="text-[0.78em] md:text-[0.84em]">
                        ({coda})
                      </span>
                    </span>
                  </span>
                  {showTagline ? (
                    <span className="absolute inset-x-0 top-0 flex flex-col gap-2 md:gap-3">
                      <PlainTypewriter
                        segments={segments}
                        phase={phase}
                        letterStaggerMs={HERO_LETTER_STAGGER_MS}
                        tailLetterStaggerMs={HERO_TAGLINE_TAIL_STAGGER_MS}
                      />
                      {showCoda ? (
                        <span className="text-[clamp(2.25rem,7vw,5.5rem)]">
                          <BracketedTypewriter
                            phrase={coda}
                            phase={phase}
                            typePhases={["coda-in"]}
                            holdPhases={["coda-idle"]}
                            deletePhases={["coda-out"]}
                            showCursor={
                              phase === "coda-in" ||
                              phase === "coda-idle" ||
                              phase === "coda-out"
                            }
                            letterStaggerMs={HERO_LETTER_STAGGER_MS}
                          />
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>
          </div>
          </h1>
        </div>
      </div>

      <button
        ref={scrollHintRef}
        type="button"
        onClick={scrollToWork}
        id="scroll-hint"
        className="pointer-events-auto fixed inset-x-0 bottom-8 z-20 flex justify-center border-0 bg-transparent p-0 text-inherit transition-opacity duration-150"
        aria-label="Scroll to past work"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            scroll
          </span>
          <div className="h-12 w-px bg-border">
            <div className="h-4 w-px animate-pulse bg-foreground" />
          </div>
        </div>
      </button>
    </section>
  );
}
