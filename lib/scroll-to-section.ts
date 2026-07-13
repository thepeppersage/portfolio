export function getHeaderHeight() {
  const header = document.getElementById("site-header");
  return header?.offsetHeight ?? 80;
}

export function syncHeaderHeight() {
  const header = document.getElementById("site-header");
  if (!header) return;

  document.documentElement.style.setProperty(
    "--header-height",
    `${header.offsetHeight}px`,
  );
}

export function getSectionDividerScrollTop(section: HTMLElement): number {
  syncHeaderHeight();
  return Math.max(0, section.offsetTop - getHeaderHeight());
}

export function scrollToSection(id: string) {
  syncHeaderHeight();

  const section = document.getElementById(id);
  if (!section) return;

  const targetTop = getSectionDividerScrollTop(section);
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    top: targetTop,
    behavior: reducedMotion ? "auto" : "smooth",
  });
}
