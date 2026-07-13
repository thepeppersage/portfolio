"use client";

import { useEffect, useRef, useState } from "react";
import {
  SECTION_BG_CLASS,
  SECTION_BG_GRAY,
  SECTION_BODY_CLASS,
  SECTION_CLASS,
  SECTION_INNER_CLASS,
} from "@/lib/section-shell";
import { FadeIn } from "./FadeIn";
import { DebugLabel, useParallaxDebug } from "./ParallaxDebug";
import { TypewriterCursor } from "./TypewriterLine";

const ABOUT_TITLE =
  "Sijia Wang is\u00A0a\u00A0product\u00A0designer with\u00A013+\u00A0years\u00A0of\u00A0experience";

/** Phrase boundaries with a beat pause after each (except the last). */
const TITLE_PHRASES = [
  "Sijia Wang",
  // nbsp only inside phrases — regular spaces between them so the line
  // can stay together when it fits, instead of forcing an early wrap.
  " is\u00A0a\u00A0product\u00A0designer",
  " with\u00A013+\u00A0years\u00A0of\u00A0experience",
] as const;

const TITLE_CLASS =
  "max-w-full text-[clamp(2.15rem,5.35vw,3.75rem)] font-light leading-tight tracking-tight";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Build reveal steps: 1–3 chars at a time, varied delays, phrase pauses. */
function buildTypeSteps(phrases: readonly string[]) {
  const steps: { count: number; delay: number }[] = [];
  let count = 0;

  phrases.forEach((phrase, phraseIndex) => {
    let i = 0;
    while (i < phrase.length) {
      const remaining = phrase.length - i;
      // Short leftover: 1 char; otherwise 2–3.
      const chunk =
        remaining <= 2
          ? remaining
          : Math.min(
              remaining,
              Math.random() < 0.35 ? 1 : Math.random() < 0.55 ? 2 : 3,
            );

      i += chunk;
      count += chunk;

      let delay = rand(38, 72);
      // Occasional quick hitch mid-phrase.
      if (Math.random() < 0.18) delay += rand(90, 180);
      // Slightly snappier on multi-char bursts.
      if (chunk >= 2) delay *= 0.85;

      steps.push({ count, delay });
    }

    // Beat pause after "Sijia Wang" / "is a product designer".
    if (phraseIndex < phrases.length - 1) {
      steps.push({ count, delay: rand(280, 420) });
    }
  });

  return steps;
}

function AboutTitleTypewriter() {
  const ref = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef(buildTypeSteps(TITLE_PHRASES));
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        stepsRef.current = buildTypeSteps(TITLE_PHRASES);
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = stepsRef.current;
    if (stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    const timer = window.setTimeout(() => {
      setCount(step.count);
      setStepIndex((i) => i + 1);
    }, step.delay);

    return () => window.clearTimeout(timer);
  }, [started, stepIndex]);

  const done = count >= ABOUT_TITLE.length;

  return (
    <h2
      ref={ref}
      className={TITLE_CLASS}
      aria-label={ABOUT_TITLE}
      style={{
        opacity: started ? 1 : 0,
        transition: "opacity 0.45s ease-out",
      }}
    >
      <span aria-hidden>
        {ABOUT_TITLE.slice(0, count)}
        {started && !done ? <TypewriterCursor /> : null}
      </span>
    </h2>
  );
}

export function About() {
  const debug = useParallaxDebug();

  return (
    // Section 3 (odd): gray bg — same shell as Section 1.
    <section
      id="about"
      data-section-parallax
      className={
        debug
          ? `${SECTION_CLASS} !min-h-[80dvh] bg-violet-200 outline outline-4 outline-violet-100`
          : `${SECTION_CLASS} ${SECTION_BG_GRAY} !min-h-[80dvh]`
      }
    >
      {/* Background — lags behind (stays on screen longer) */}
      <div
        data-section-bg
        aria-hidden
        className={
          debug
            ? `${SECTION_BG_CLASS} bg-violet-200`
            : `${SECTION_BG_CLASS} ${SECTION_BG_GRAY}`
        }
      >
        <DebugLabel>§3 bg (lags)</DebugLabel>
      </div>
      {/* Content — moves off the page faster than the background */}
      <div
        data-section-body
        className={`${SECTION_BODY_CLASS} !min-h-[80dvh] -translate-y-[8vh] !pb-12`}
      >
        <DebugLabel corner="tr">§3 content (exits faster)</DebugLabel>
        <div
          className={
            debug
              ? `${SECTION_INNER_CLASS} bg-violet-100/80`
              : SECTION_INNER_CLASS
          }
        >
          <div className="flex min-w-0 w-full max-w-full flex-col gap-5">
              <AboutTitleTypewriter />
              <FadeIn className="min-w-0 w-full max-w-[70%]" delay={200}>
                <p className="max-w-full font-mono text-[clamp(0.9375rem,1.85vw,1.125rem)] tracking-wider text-muted text-balance break-words">
                  Previously at Square, Yelp, Shopstyle. Background in visual
                  design and video production.
                </p>
              </FadeIn>
            </div>
        </div>
      </div>
    </section>
  );
}
