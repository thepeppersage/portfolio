export const site = {
  credit: "Vibe coded in 2026",
  heroLead: "always ask",
  heroPhrase: " why does this exist ",
  heroCoda: " answered rigorously ",
  heroTaglineSegments: [
    "good design comes from",
    " good questions",
  ] as const,
  workIntro:
    "I worked across Square's ecosystem on various teams over the last 6 years at Square including Customers, Merchant Marketing, Restaurant Management, and Kitchen Display systems.",
};

export const navLinks = [
  { label: "( work )", href: "#work" },
  { label: "( about me )", href: "#about" },
];

export const projects = [
  {
    slug: "restaurant-management",
    title: "Live Reporting",
    category: "Square • 2023-2025",
    description:
      "Reporting tools that help restaurant operators understand sales, labor, and trends without drowning in spreadsheets.",
    images: [
      { src: "/assets/live-sales/1.png", alt: "Live Sales 1" },
      { src: "/assets/live-sales/2.png", alt: "Live Sales 2" },
      { src: "/assets/live-sales/3.png", alt: "Live Sales 3" },
    ],
    overview: {
      headline:
        "I designed reporting tools across Square's ecosystem on Dashboard, POS, and mobile that helped restaurants understand and improve their daily operations",
      goalsLabel: "Context",
      goals: [
        "I spent a week in Phoenix, AZ, working directly with full-service and quick-service restaurant operators to understand how they monitor and manage daily performance. Working closely with my PM partner, we uncovered a need for reporting that was more immediate, actionable, and grounded in the realities of running a restaurant day to day.",
        "Over the next six months, we designed, built, and shipped Live Reporting, a real-time reporting experience for Square's Restaurant POS. We also partnered with Platform teams across Square to bring live operational metrics into the broader Square ecosystem—making today's performance easier to see, understand, and act on.",
      ],
    },
  },
  {
    slug: "kitchen-display-systems",
    title: "Kitchen Display System",
    category: "Square • 2025-2026",
    description:
      "Order routing and prep workflows for back-of-house teams — clearer ticket states, faster handoffs, and less noise on the line.",
    images: [
      { src: "/assets/kds/kds-vision.png", alt: "KDS vision" },
      { src: "/assets/kds/Redesign.png", alt: "KDS redesign" },
      { src: "/assets/kds/Foundation.png", alt: "KDS foundation" },
      { src: "/assets/kds/Chits.png", alt: "KDS chits" },
    ],
    afterImages:
      "KDS is kitchen-facing software that is the heart of restaurant operations, but not a well-known product in Square's massive ecosystem",
    overview: {
      headline:
        "I redesigned the KDS experience to create a clearer, more cohesive system—restructuring content and navigation, simplifying device management and settings, and refreshing the visual language.",
      goalsLabel: "Redesign Goals",
      goals: [
        "Modernize the KDS with a cleaner visual design and more scalable design system.",
        "Reorganize settings to improve discoverability and reduce configuration time.",
        "Simplify dashboard management, making it easier to create, organize, and manage multiple kitchen displays.",
      ],
    },
  },
  {
    slug: "marketing-automation",
    title: "Marketing Automation",
    category: "Square • 2019-2022",
    description:
      "Surfacing what guests order most — helping teams spot trends, adjust menus, and double down on what works.",
    images: [
      { src: "/assets/Marketing/Automation.png", alt: "Marketing automation" },
      { src: "/assets/Marketing/Design.png", alt: "Marketing design" },
    ],
    overview: {
      headline:
        "I designed email and text message marketing tools & automations and that helped Square merchants retain and acquire customers.",
      goalsLabel: "Context",
      goals: [
        "Our team built marketing tools to turn real customer and order insights into timely, actionable marketing opportunities. By surfacing meaningful signals—like top-performing items and guest preferences—merchants could better understand what was resonating and respond with more relevant menus, campaigns, and offers.",
      ],
    },
  },
];

export type Project = (typeof projects)[number] & {
  images?: { src: string; alt: string }[];
  afterImages?: string;
};

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
