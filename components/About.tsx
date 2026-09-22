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

const ABOUT_TITLE =
  "Product designer with 13+ years of experience simplifying complex ecosystems for diverse audiences and emerging technology";

const TITLE_PARTS = ABOUT_TITLE.split(/(\s+)/);

const TITLE_CLASS =
  "max-w-full text-[clamp(2.75rem,6.8vw,4.85rem)] font-bold leading-[1.12] tracking-tight text-pretty";

const WORD_MUTED = "#bbbbbb";
const WORD_STAGGER_MS = 60;
const WORD_COLOR_MS = 450;
const HIGHLIGHT_WORDS = ["Product", "designer"] as const;
const HIGHLIGHT_LETTERS = HIGHLIGHT_WORDS.join("").split("");
const HIGHLIGHT_COLORS = ["#1e40af", "#0f766e", "#0369a1", "#15803d"] as const;
const LETTER_STAGGER_MS = 45;
const LETTER_HOLD_MS = 280;

function HighlightedWords({
  revealed,
  reduceMotion,
  delay,
}: {
  revealed: boolean;
  reduceMotion: boolean;
  delay: number;
}) {
  const [tint, setTint] = useState<Array<string | null>>(
    () => HIGHLIGHT_LETTERS.map(() => null),
  );

  useEffect(() => {
    if (!revealed || reduceMotion) return;

    const timers: number[] = [];
    let cancelled = false;

    const run = () => {
      HIGHLIGHT_LETTERS.forEach((_, i) => {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setTint((current) => {
              const next = [...current];
              next[i] = HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
              return next;
            });
          }, i * LETTER_STAGGER_MS),
        );
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setTint((current) => {
              const next = [...current];
              next[i] = null;
              return next;
            });
          }, i * LETTER_STAGGER_MS + LETTER_HOLD_MS),
        );
      });
    };

    const start = window.setTimeout(run, delay + WORD_COLOR_MS + 240);
    const loop = window.setInterval(run, 4200);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(loop);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [revealed, reduceMotion, delay]);

  let letterIndex = 0;

  return (
    <>
      {HIGHLIGHT_WORDS.map((word, wordIndex) => (
        <span key={word}>
          {wordIndex > 0 ? " " : null}
          <span className="whitespace-nowrap">
            {word.split("").map((ch) => {
              const index = letterIndex;
              letterIndex += 1;
              return (
                <span
                  key={`${word}-${index}`}
                  style={{
                    color: tint[index] ?? (revealed ? "#000000" : WORD_MUTED),
                    transition:
                      reduceMotion || revealed
                        ? "none"
                        : `color ${WORD_COLOR_MS}ms ease ${delay}ms`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </>
  );
}

function AboutTitleReveal() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduced = media.matches;
    setReduceMotion(prefersReduced);

    const el = ref.current;
    if (!el || prefersReduced) {
      setRevealed(true);
      return;
    }

    let paint: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        paint = requestAnimationFrame(() => {
          paint = requestAnimationFrame(() => setRevealed(true));
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (paint !== undefined) cancelAnimationFrame(paint);
    };
  }, []);

  let wordIndex = 0;

  return (
    <h2 ref={ref} className={TITLE_CLASS}>
      {TITLE_PARTS.map((part, i) => {
        if (part === "Product") {
          const delay = wordIndex * WORD_STAGGER_MS;
          wordIndex += 2;
          return (
            <HighlightedWords
              key="product-designer"
              revealed={revealed}
              reduceMotion={reduceMotion}
              delay={delay}
            />
          );
        }

        if (part === "designer" || (part === " " && TITLE_PARTS[i - 1] === "Product")) {
          return null;
        }

        if (/^\s+$/.test(part)) {
          return <span key={i}>{part}</span>;
        }

        const delay = wordIndex * WORD_STAGGER_MS;
        wordIndex += 1;

        return (
          <span
            key={i}
            style={{
              color: revealed ? "#000000" : WORD_MUTED,
              transition: reduceMotion
                ? "none"
                : `color ${WORD_COLOR_MS}ms ease ${delay}ms`,
            }}
          >
            {part}
          </span>
        );
      })}
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
        className={`${SECTION_BODY_CLASS} !min-h-[80dvh] !pb-16`}
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
              <AboutTitleReveal />
              <FadeIn className="min-w-0 w-full max-w-[70%]" delay={200}>
                <p className="max-w-full font-mono text-[clamp(0.9375rem,1.85vw,1.125rem)] tracking-wider text-muted break-words">
                  For 13+ years, I&apos;ve designed across a wide range of B2B,
                  SaaS, and consumer products – finding structure in complexity
                  and interconnected systems, and turning it into experiences
                  people can use.
                  <br />
                  <br />
                  Previously at Square, Yelp, Shopstyle, with a background in
                  visual and video production in agency.
                </p>
              </FadeIn>
            </div>
        </div>
      </div>
    </section>
  );
}
