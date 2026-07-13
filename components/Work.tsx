"use client";

import Link from "next/link";
import { projects } from "@/lib/data";
import {
  SECTION_BG_BLACK,
  SECTION_BG_CLASS,
  SECTION_BODY_CLASS,
  SECTION_CLASS,
  SECTION_INNER_CLASS,
} from "@/lib/section-shell";
import { DebugLabel, useParallaxDebug } from "./ParallaxDebug";

export function Work() {
  const debug = useParallaxDebug();

  return (
    // Section 2 (even): black bg — same shell as §1 (content exits faster than bg).
    <section
      id="work"
      data-section-parallax
      className={
        debug
          ? `${SECTION_CLASS} bg-amber-300 outline outline-4 outline-amber-100`
          : `${SECTION_CLASS} ${SECTION_BG_BLACK}`
      }
    >
      {/* Background — lags behind (stays on screen longer) */}
      <div
        data-section-bg
        aria-hidden
        className={
          debug
            ? `${SECTION_BG_CLASS} bg-amber-300`
            : `${SECTION_BG_CLASS} ${SECTION_BG_BLACK}`
        }
      >
        <DebugLabel>§2 bg (lags)</DebugLabel>
      </div>
      {/* Content — moves off the page faster than the background */}
      <div
        data-section-body
        className={
          debug
            ? `${SECTION_BODY_CLASS} text-[#141414]`
            : `${SECTION_BODY_CLASS} text-[#f5f0e8]`
        }
      >
        <DebugLabel corner="tr">§2 content (exits faster)</DebugLabel>
        <div
          className={
            debug
              ? `${SECTION_INNER_CLASS} bg-lime-300/90`
              : SECTION_INNER_CLASS
          }
        >
          <p
            className={
              debug
                ? "font-sans text-sm font-medium leading-relaxed text-[#141414]"
                : "font-sans text-sm font-medium leading-relaxed text-white"
            }
          >
            Sample work from Square
          </p>

          <div
            className={
              debug
                ? "mt-4 grid grid-cols-1 divide-y divide-[#141414]/20 border border-[#141414]/20 lg:grid-cols-3 lg:divide-x"
                : "mt-4 grid grid-cols-1 divide-y divide-[#f5f0e8]/20 border border-[#f5f0e8]/20 lg:grid-cols-3 lg:divide-x"
            }
          >
            {projects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group flex h-auto min-w-0 flex-col overflow-hidden rounded-[1px] p-6 outline outline-1 outline-transparent transition-[outline-color] duration-300 hover:outline-[#f5ecc0] md:p-8 lg:h-[38rem] lg:p-10"
              >
                <span
                  className={
                    debug
                      ? "font-sans text-[clamp(2rem,4vw,3rem)] font-light leading-none text-[#141414]/25 transition-[color,font-weight] duration-300 group-hover:font-normal group-hover:text-[#f5ecc0]"
                      : "font-sans text-[clamp(2rem,4vw,3rem)] font-light leading-none text-[#f5f0e8]/25 transition-[color,font-weight] duration-300 group-hover:font-normal group-hover:text-[#f5ecc0]"
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="!font-sans mt-5 max-w-full text-[clamp(1.75rem,3vw,2.75rem)] font-bold uppercase leading-[1.05] tracking-tight break-words">
                  {project.title}
                </h3>

                <p
                  className={
                    debug
                      ? "mt-8 max-w-full font-sans text-sm leading-[1.65] text-[#141414]/85 break-words md:text-[0.9375rem]"
                      : "mt-8 max-w-full font-sans text-sm leading-[1.65] text-[#f5f0e8]/85 break-words md:text-[0.9375rem]"
                  }
                >
                  {project.description}
                </p>

                <p
                  className={
                    debug
                      ? "mt-8 max-w-full pt-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#141414]/40 break-words transition-colors duration-300 group-hover:text-[#f5ecc0] lg:mt-auto lg:pt-8"
                      : "mt-8 max-w-full pt-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#f5f0e8]/40 break-words transition-colors duration-300 group-hover:text-[#f5ecc0] lg:mt-auto lg:pt-8"
                  }
                >
                  {project.category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
