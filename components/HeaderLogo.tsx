"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LOGO_SHORT = "( sw )";
const LOGO_FULL = "( sijia wang )";
const TYPE_MS = 28;
const DELETE_MS = 18;

export function HeaderLogo() {
  const [text, setText] = useState(LOGO_SHORT);
  const [hovered, setHovered] = useState(false);
  const textRef = useRef(LOGO_SHORT);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const target = hovered ? LOGO_FULL : LOGO_SHORT;

    const step = () => {
      const current = textRef.current;
      if (current === target) {
        timerRef.current = null;
        return;
      }

      let i = 0;
      while (
        i < current.length &&
        i < target.length &&
        current[i] === target[i]
      ) {
        i += 1;
      }

      if (current.length > i) {
        const next = current.slice(0, current.length - 1);
        textRef.current = next;
        setText(next);
        timerRef.current = window.setTimeout(step, DELETE_MS);
        return;
      }

      const next = target.slice(0, current.length + 1);
      textRef.current = next;
      setText(next);
      timerRef.current = window.setTimeout(step, TYPE_MS);
    };

    step();

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hovered]);

  return (
    <Link
      href="/"
      className="relative inline-flex items-baseline font-mono text-base leading-none md:text-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label="Sijia Wang"
    >
      <span className="invisible whitespace-pre" aria-hidden>
        {LOGO_FULL}
      </span>
      <span className="absolute inset-y-0 left-0 whitespace-pre">{text}</span>
    </Link>
  );
}
