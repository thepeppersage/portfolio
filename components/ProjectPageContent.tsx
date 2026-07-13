"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/data";

export function ProjectPageContent({ project }: { project: Project }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translate3d(0, 0, 0)";
    });

    const clearTransition = window.setTimeout(() => {
      el.style.transition = "none";
    }, 300);

    if (reduceMotion) {
      return () => window.clearTimeout(clearTransition);
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY * 0.35;
        el.style.transform = `translate3d(0, ${-y}px, 0)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(clearTransition);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const heroImage = project.heroImage;

  return (
    <main
      data-cursor-surface="dark"
      className="min-h-dvh bg-[#141414] text-[#f5f0e8]"
    >
      <div className="px-9 pt-[calc(var(--header-height)+2.5rem)] pb-24 lg:px-6">
        <div
          ref={contentRef}
          className="mx-auto w-full max-w-7xl will-change-transform"
          style={{
            opacity: 0,
            transform: "translate3d(0, 16px, 0)",
            transition: "opacity 280ms ease-out, transform 280ms ease-out",
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#f5f0e8]/40">
            {project.category}
          </p>
          <h1 className="!font-sans mt-4 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-tight break-words">
            {project.title}
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-base leading-[1.65] text-[#f5f0e8]/85 md:text-lg">
            {project.description}
          </p>

          {heroImage ? (
            <div className="relative mt-14 w-full overflow-hidden">
              <Image
                src={heroImage}
                alt={`${project.title} hero`}
                width={2400}
                height={1350}
                priority
                className="h-auto w-full"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
