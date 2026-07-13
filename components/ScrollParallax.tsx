"use client";

import { useEffect } from "react";
import {
  BACKGROUND_LAG_SPEED,
  CONTENT_EXIT_SPEED,
} from "@/lib/parallax";
import { getSectionDividerScrollTop } from "@/lib/scroll-to-section";

/**
 * Section parallax (Hero / Section 1 model):
 * Content scrolls off faster than the background — continuous with scrollY,
 * no discrete lead/jump.
 */

function sizeBackground(
  bg: HTMLElement,
  sectionHeight: number,
  lagPx = 0,
) {
  // Pull top up by lag so translateY(lag) still covers the section without
  // painting past the bottom into the stretch band / next section.
  bg.style.bottom = "auto";
  bg.style.top = lagPx > 0 ? `${-lagPx}px` : "0";
  bg.style.height = `${sectionHeight + lagPx}px`;
}

/** Pixels scrolled into the section — continuous from 0, no lead offset. */
function scrollProgressIntoSection(
  section: HTMLElement,
  scrollY: number,
  viewportHeight: number,
) {
  const sectionTop = getSectionDividerScrollTop(section);
  const scrolled = scrollY - sectionTop;
  if (scrolled <= 0) return 0;
  // Cap to one viewport so tall sections don't over-drive.
  return Math.min(scrolled, viewportHeight);
}

export function ScrollParallax() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;

    const resetSection = (
      bg: HTMLElement,
      content: HTMLElement | null,
      sectionHeight: number,
    ) => {
      bg.style.transform = "translate3d(0, 0, 0)";
      sizeBackground(bg, sectionHeight);
      if (content) content.style.transform = "translate3d(0, 0, 0)";
    };

    const update = () => {
      raf = 0;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      if (reduceMotion) return;

      for (const section of document.querySelectorAll<HTMLElement>(
        "[data-section-parallax]",
      )) {
        const bg = section.querySelector<HTMLElement>("[data-section-bg]");
        const content = section.querySelector<HTMLElement>(
          "[data-section-body]",
        );
        if (!bg) continue;

        const sectionHeight = section.offsetHeight;

        const rect = section.getBoundingClientRect();
        const inRange =
          rect.bottom > -viewportHeight * 0.35 &&
          rect.top < viewportHeight * 1.35;

        if (!inRange) {
          resetSection(bg, content, sectionHeight);
          continue;
        }

        const progress = scrollProgressIntoSection(
          section,
          scrollY,
          viewportHeight,
        );

        const backgroundLagPx = progress * BACKGROUND_LAG_SPEED;
        sizeBackground(bg, sectionHeight, backgroundLagPx);
        bg.style.transform = `translate3d(0, ${backgroundLagPx}px, 0)`;

        if (content) {
          // Viewport-tall sections can exit faster than the bg. On taller
          // sections (stacked mobile work cards) the same speed leaves a
          // large empty gap under the content — scale exit down.
          const tallScale = Math.min(
            1,
            viewportHeight / Math.max(sectionHeight, 1),
          );
          const contentExitPx =
            progress * CONTENT_EXIT_SPEED * tallScale;
          content.style.transform = `translate3d(0, ${-contentExitPx}px, 0)`;
        }
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

      for (const section of document.querySelectorAll<HTMLElement>(
        "[data-section-parallax]",
      )) {
        const bg = section.querySelector<HTMLElement>("[data-section-bg]");
        const content = section.querySelector<HTMLElement>(
          "[data-section-body]",
        );
        if (!bg) continue;
        resetSection(bg, content, section.offsetHeight);
      }
    };
  }, []);

  return null;
}
