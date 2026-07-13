"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const ParallaxDebugContext = createContext(false);

export function useParallaxDebug() {
  return useContext(ParallaxDebugContext);
}

/** Press P to toggle section layer colors. Starts off. */
export function ParallaxDebugProvider({ children }: { children: ReactNode }) {
  const [parallaxDebug, setParallaxDebug] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "p" && event.key !== "P") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      event.preventDefault();
      setParallaxDebug((on) => !on);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <ParallaxDebugContext.Provider value={parallaxDebug}>
      {children}
    </ParallaxDebugContext.Provider>
  );
}

/** Corner label for a debug layer — only renders when debug is on. */
export function DebugLabel({
  children,
  corner = "tl",
}: {
  children: ReactNode;
  corner?: "tl" | "tr" | "bl" | "br";
}) {
  const debug = useParallaxDebug();
  if (!debug) return null;

  const cornerClass =
    corner === "tl"
      ? "left-2 top-2"
      : corner === "tr"
        ? "right-2 top-2"
        : corner === "bl"
          ? "bottom-2 left-2"
          : "bottom-2 right-2";

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${cornerClass} z-50 rounded bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white`}
    >
      {children}
    </span>
  );
}
