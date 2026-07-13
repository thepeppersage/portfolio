"use client";

import { useEffect, useRef, useState } from "react";

const CLICKABLE_SELECTOR =
  'a, button, [role="button"], input:not([type="hidden"]), select, textarea, summary, label[for]';

/** On gray / light section backgrounds. */
const CURSOR_ON_LIGHT_BG = "#000000";
/** On black section backgrounds — same gray as the light section bg. */
const CURSOR_ON_DARK_BG = "#e2e2e2";

function pointInRect(x: number, y: number, rect: DOMRect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function cursorColorAt(x: number, y: number): string {
  for (const stretch of document.querySelectorAll<HTMLElement>(
    "[data-stretch-band]",
  )) {
    if (stretch.offsetHeight <= 0) continue;
    if (!pointInRect(x, y, stretch.getBoundingClientRect())) continue;
    return stretch.dataset.stretchAfter === "hero"
      ? CURSOR_ON_DARK_BG
      : CURSOR_ON_LIGHT_BG;
  }

  let matched: HTMLElement | null = null;
  for (const section of document.querySelectorAll<HTMLElement>(
    "[data-section-parallax]",
  )) {
    if (pointInRect(x, y, section.getBoundingClientRect())) {
      matched = section;
    }
  }
  if (matched) {
    return matched.id === "work" ? CURSOR_ON_DARK_BG : CURSOR_ON_LIGHT_BG;
  }

  // Project / other pages without parallax sections (e.g. work slug pages).
  const darkSurface = document
    .elementsFromPoint(x, y)
    .find(
      (el) =>
        el instanceof HTMLElement &&
        el.closest('[data-cursor-surface="dark"]'),
    );
  if (darkSurface) return CURSOR_ON_DARK_BG;

  return CURSOR_ON_LIGHT_BG;
}

function CrossCursorIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        d="M16 5v22M5 16h22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Circle cursor for interactive targets. */
function ClickCursorIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CustomCursor() {
  const [active, setActive] = useState(false);
  const [clickable, setClickable] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastColorRef = useRef(CURSOR_ON_LIGHT_BG);
  const lastClickableRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    const enable = () => {
      const isActive = finePointer.matches;
      setActive(isActive);
      document.documentElement.classList.toggle("custom-cursor-active", isActive);
    };

    enable();
    finePointer.addEventListener("change", enable);

    return () => {
      finePointer.removeEventListener("change", enable);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const applyColor = (x: number, y: number) => {
      const root = rootRef.current;
      if (!root) return;
      const nextColor = cursorColorAt(x, y);
      if (nextColor === lastColorRef.current) return;
      lastColorRef.current = nextColor;
      root.style.color = nextColor;
    };

    const onMove = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      const root = rootRef.current;
      if (root) {
        root.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      }
      applyColor(event.clientX, event.clientY);

      const target = document.elementFromPoint(event.clientX, event.clientY);
      const nextClickable = !!target?.closest(CLICKABLE_SELECTOR);
      if (nextClickable !== lastClickableRef.current) {
        lastClickableRef.current = nextClickable;
        setClickable(nextClickable);
      }
    };

    const onScrollOrResize = () => {
      const { x, y } = pointerRef.current;
      applyColor(x, y);
      const target = document.elementFromPoint(x, y);
      const nextClickable = !!target?.closest(CLICKABLE_SELECTOR);
      if (nextClickable !== lastClickableRef.current) {
        lastClickableRef.current = nextClickable;
        setClickable(nextClickable);
      }
    };

    const onLeave = () => {
      lastClickableRef.current = false;
      setClickable(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    document.documentElement.addEventListener("mouseleave", onLeave);

    // Initial color for dark pages (slug routes) before first mouse move.
    applyColor(
      pointerRef.current.x || window.innerWidth / 2,
      pointerRef.current.y || window.innerHeight / 2,
    );

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      data-custom-cursor
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        color: CURSOR_ON_LIGHT_BG,
        willChange: "transform",
      }}
    >
      {clickable ? <ClickCursorIcon /> : <CrossCursorIcon />}
    </div>
  );
}
