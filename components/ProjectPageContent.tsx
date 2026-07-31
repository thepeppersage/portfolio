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
        const y = window.scrollY * 0.12;
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

  const images = project.images ?? [];

  return (
    <main className="min-h-dvh bg-[#e2e2e2] text-black">
      <div className="px-9 pt-[calc(var(--header-height)+2.5rem)] pb-10 lg:px-6">
        <div
          ref={contentRef}
          className="mx-auto w-full max-w-7xl will-change-transform"
          style={{
            opacity: 0,
            transform: "translate3d(0, 16px, 0)",
            transition: "opacity 280ms ease-out, transform 280ms ease-out",
          }}
        >
          <h1 className="!font-sans max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight break-words">
            {project.title}
          </h1>

          {project.overview ? (
            <section className="mt-20 grid grid-cols-1 gap-16 lg:mt-28 lg:grid-cols-2 lg:gap-32">
              <div>
                <p className="font-sans text-base text-black/45">What I did</p>
                <div className="mt-3 border-t border-black/20" />
                <h2 className="mt-6 whitespace-pre-line text-[clamp(1.25rem,2.2vw,1.75rem)] font-normal leading-[1.35] tracking-tight text-black">
                  {project.overview.headline}
                </h2>
              </div>

              <div>
                <p className="font-sans text-base text-black/45">
                  {project.overview.goalsLabel}
                </p>
                <div className="mt-3 border-t border-black/20" />
                {project.overview.goalsLabel === "Redesign Goals" ? (
                  <ol className="mt-6 space-y-4 font-sans text-base leading-[1.65] text-black/75">
                    {project.overview.goals.map((goal, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-5 shrink-0 tabular-nums text-black/75">
                          {i + 1}.
                        </span>
                        <span className="min-w-0 flex-1">{goal}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="mt-6 space-y-4 font-sans text-base leading-[1.65] text-black/75">
                    {project.overview.goals.map((goal, i) => (
                      <p key={i}>{goal}</p>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : null}

          {images.length > 0 ? (
            <div className="mt-14 flex flex-col gap-16 lg:mt-20 lg:gap-24">
              {images.map((image, i) => (
                <div key={image.src} className="relative w-full overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={2400}
                    height={1350}
                    priority={i === 0}
                    className="h-auto w-full"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>
              ))}
            </div>
          ) : null}

          {project.afterImages ? (
            <p className="mt-16 max-w-5xl font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[1.15] tracking-tight text-black lg:mt-20">
              {project.afterImages
                .split("heart of restaurant operations")
                .flatMap((part, i, arr) =>
                  i < arr.length - 1
                    ? [
                        part,
                        <strong key={i} className="font-bold">
                          heart of restaurant operations
                        </strong>,
                      ]
                    : [part],
                )}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
