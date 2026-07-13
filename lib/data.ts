export const site = {
  credit: "Vibe coded in 2026",
  heroLead: "always ask",
  heroPhrase: " why does this exist ",
  heroCoda: " answered rigorously ",
  heroTaglineSegments: [
    "good design comes from",
    " good questions",
  ] as const,
};

export const navLinks = [
  { label: "( work )", href: "#work" },
  { label: "( about me )", href: "#about" },
];

export const projects = [
  {
    slug: "kitchen-display-systems",
    title: "Kitchen Display Systems",
    category: "Square • 2025-2026",
    description:
      "Order routing and prep workflows for back-of-house teams — clearer ticket states, faster handoffs, and less noise on the line.",
    heroImage: "/assets/kds/kds-hero.png",
  },
  {
    slug: "restaurant-management",
    title: "Restaurant management",
    category: "Square • 2023-2025",
    description:
      "Reporting tools that help restaurant operators understand sales, labor, and trends without drowning in spreadsheets.",
  },
  {
    slug: "marketing-automation",
    title: "Marketing Automation",
    category: "Square • 2022",
    description:
      "Surfacing what guests order most — helping teams spot trends, adjust menus, and double down on what works.",
  },
];

export type Project = (typeof projects)[number] & {
  heroImage?: string;
};

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
