/** Shared section shell — every page section uses these exact layers & paddings. */

export const SECTION_CLASS =
  "relative isolate min-h-dvh overflow-hidden scroll-mt-[var(--header-height)]";

export const SECTION_BG_CLASS =
  "pointer-events-none absolute inset-0 z-0 w-full will-change-transform";

/** Content box — same margins/padding on every section. */
export const SECTION_BODY_CLASS =
  "relative z-0 flex min-h-dvh items-center justify-center px-9 pt-[calc(var(--header-height)+2.5rem)] pb-[var(--header-height)] will-change-transform lg:px-6";

export const SECTION_INNER_CLASS = "mx-auto w-full max-w-7xl";

/** Alternating section backgrounds: odd = gray, even = black. */
export const SECTION_BG_GRAY = "bg-background";
export const SECTION_BG_BLACK = "bg-[#141414]";
