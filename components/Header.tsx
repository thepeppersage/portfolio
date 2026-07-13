"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "@/lib/data";
import {
  scrollToSection,
  syncHeaderHeight,
  getHeaderHeight,
} from "@/lib/scroll-to-section";
import { HeaderLogo } from "./HeaderLogo";

const FALLBACK_SURFACE = "#e2e2e2";
const PROJECT_DARK_SURFACE = "rgb(20, 20, 20)";

type Rgba = { r: number; g: number; b: number; a: number };

type HeaderFill =
  | { mode: "solid"; color: string; dark: boolean }
  | {
      mode: "split";
      topColor: string;
      bottomColor: string;
      /** 0 = split at top, 1 = split at bottom (fraction of header height). */
      split: number;
      dark: boolean;
    };

function parseRgba(color: string): Rgba | null {
  const match = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function isOpaqueFill(color: string) {
  const rgba = parseRgba(color);
  return Boolean(rgba && rgba.a >= 0.4);
}

function isDarkFill(color: string) {
  const rgba = parseRgba(color);
  if (!rgba || rgba.a < 0.4) return false;
  const lum = (0.2126 * rgba.r + 0.7152 * rgba.g + 0.0722 * rgba.b) / 255;
  return lum < 0.45;
}

function colorsMatch(a: string, b: string) {
  const pa = parseRgba(a);
  const pb = parseRgba(b);
  if (!pa || !pb) return a === b;
  return (
    Math.abs(pa.r - pb.r) < 2 &&
    Math.abs(pa.g - pb.g) < 2 &&
    Math.abs(pa.b - pb.b) < 2
  );
}

function fillsEqual(a: HeaderFill, b: HeaderFill) {
  if (a.mode !== b.mode || a.dark !== b.dark) return false;
  if (a.mode === "solid" && b.mode === "solid") {
    return colorsMatch(a.color, b.color);
  }
  if (a.mode === "split" && b.mode === "split") {
    return (
      colorsMatch(a.topColor, b.topColor) &&
      colorsMatch(a.bottomColor, b.bottomColor) &&
      Math.abs(a.split - b.split) < 0.02
    );
  }
  return false;
}

function colorFromNode(node: HTMLElement) {
  const inline = node.style.backgroundColor;
  if (inline && isOpaqueFill(inline)) return inline;
  const computed = getComputedStyle(node).backgroundColor;
  if (isOpaqueFill(computed)) return computed;
  return null;
}

/** Only sample intentional page surfaces — avoids body/html flicker. */
function sampleColorAt(x: number, y: number): string {
  const stack = document.elementsFromPoint(x, y);
  for (const el of stack) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.closest("#site-header")) continue;

    const darkPage = el.closest<HTMLElement>('[data-cursor-surface="dark"]');
    if (darkPage) {
      return colorFromNode(darkPage) ?? PROJECT_DARK_SURFACE;
    }

    const stretch = el.closest<HTMLElement>("[data-stretch-band]");
    if (stretch && stretch.offsetHeight > 0) {
      const color = colorFromNode(stretch);
      if (color) return color;
    }

    const sectionBg = el.closest<HTMLElement>("[data-section-bg]");
    if (sectionBg) {
      const color = colorFromNode(sectionBg);
      if (color) return color;
    }

    const section = el.closest<HTMLElement>("[data-section-parallax]");
    if (section) {
      const color = colorFromNode(section);
      if (color) return color;
    }
  }
  return FALLBACK_SURFACE;
}

function initialFillForPath(pathname: string): HeaderFill {
  if (pathname.startsWith("/work")) {
    return {
      mode: "solid",
      color: PROJECT_DARK_SURFACE,
      dark: true,
    };
  }
  return {
    mode: "solid",
    color: FALLBACK_SURFACE,
    dark: false,
  };
}

/**
 * Track the color boundary as it moves through the header so the menu fill
 * wipes with scroll (new color enters from the scroll direction).
 */
function sampleHeaderFill(pathname: string): HeaderFill {
  // Project pages: lock solid dark from the route — never sample body gray.
  if (pathname.startsWith("/work")) {
    return initialFillForPath(pathname);
  }

  const headerH = Math.max(1, getHeaderHeight());
  const x = Math.min(window.innerWidth - 1, Math.max(1, window.innerWidth / 2));
  const topY = 2;
  const bottomY = Math.max(topY + 1, headerH - 2);
  const belowY = Math.min(window.innerHeight - 1, headerH + 2);

  const topColor = sampleColorAt(x, topY);
  const bottomColor = sampleColorAt(x, bottomY);
  const belowColor = sampleColorAt(x, belowY);

  if (!colorsMatch(topColor, bottomColor)) {
    if (
      colorsMatch(belowColor, topColor) ||
      colorsMatch(belowColor, bottomColor)
    ) {
      let lo = topY;
      let hi = bottomY;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (colorsMatch(sampleColorAt(x, mid), topColor)) lo = mid;
        else hi = mid;
      }

      return {
        mode: "split",
        topColor,
        bottomColor,
        split: hi / headerH,
        dark: isDarkFill(sampleColorAt(x, headerH * 0.5)),
      };
    }

    return {
      mode: "solid",
      color: belowColor,
      dark: isDarkFill(belowColor),
    };
  }

  return {
    mode: "solid",
    color: topColor,
    dark: isDarkFill(topColor),
  };
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  // null = use route-based fill so /work/* never paints light on first frame
  const [fillOverride, setFillOverride] = useState<HeaderFill | null>(null);
  const fill = fillOverride ?? initialFillForPath(pathname);

  const goToSection = (id: string) => {
    if (pathname === "/") {
      scrollToSection(id);
      return;
    }
    router.push(`/#${id}`);
  };

  useEffect(() => {
    // Reset override on route change so project pages stay dark from path.
    setFillOverride(null);

    let raf = 0;
    const update = () => {
      raf = 0;
      syncHeaderHeight();
      const next = sampleHeaderFill(pathname);
      setFillOverride((prev) => {
        const baseline = prev ?? initialFillForPath(pathname);
        return fillsEqual(baseline, next) ? prev : next;
      });
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
  }, [pathname]);

  useEffect(() => {
    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);
    return () => window.removeEventListener("resize", syncHeaderHeight);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash !== "work" && hash !== "about") return;

    syncHeaderHeight();
    requestAnimationFrame(() => scrollToSection(hash));
  }, [pathname]);

  const onDark = fill.dark;
  const ink = onDark ? "text-[#f5f0e8]" : "text-foreground";
  const muted = onDark ? "text-[#f5f0e8]/55" : "text-muted";

  return (
    <header id="site-header" className={`fixed inset-x-0 top-0 z-50 ${ink}`}>
      {/* Opaque fill that wipes with the color boundary under the menu */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {fill.mode === "solid" ? (
          <div className="absolute inset-0" style={{ backgroundColor: fill.color }} />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ backgroundColor: fill.bottomColor }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: fill.topColor,
                clipPath: `inset(0 0 ${(1 - fill.split) * 100}% 0)`,
              }}
            />
          </>
        )}
      </div>

      <div className="relative px-9 py-5 lg:px-6">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <HeaderLogo />

          <nav className="flex shrink-0 items-center gap-4 sm:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`link-underline font-mono text-sm transition-colors sm:text-base md:text-lg ${muted} ${
                  onDark ? "hover:text-[#f5f0e8]" : "hover:text-foreground"
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  goToSection(link.href.replace("#", ""));
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
