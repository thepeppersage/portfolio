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
    title: "Kitchen Display Systems redesign",
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
        "I redesigned the KDS, refreshing the system's visuals, re-organizing content & navigation, and simplifying device management.",
      goalsLabel: "Redesign Goals",
      goals: [
        "Modernize the KDS with a cleaner visual design and more scalable design system.",
        "Reorganize settings to improve discoverability and reduce configuration time.",
        "Simplify dashboard management, making it easier to create, organize, and manage multiple kitchen displays.",
      ],
    },
  },
  {
    slug: "restaurant-management",
    title: "Live Sales reporting",
    category: "Square • 2023-2025",
    description:
      "Reporting tools that help restaurant operators understand sales, labor, and trends without drowning in spreadsheets.",
    images: [
      {
        src: "/assets/live-sales/Lives-sales-new.png",
        alt: "Live Sales redesign",
      },
      {
        src: "/assets/live-sales/Live-Sales-Desktop.png",
        alt: "Live Sales reporting",
      },
    ],
    overview: {
      headline:
        "I designed reporting tools across Square's ecosystem on Dashboard, POS, and mobile that helped restaurants understand and improve their daily operations",
      goalsLabel: "Context",
      goals: [
        "For restaurant operations, no timeline is as important as Today",
        'After spending a week in person designing and prototyping with restaurants in Phoenix, AZ in the QSR sector, the PM and myself deeply understood the reporting features needed around daily operations. We spent 6 months designing "Live Sales" reporting for the Restaurants POS, as well as partnering with Platform teams at Square to inject \'live\' metrics into Square\'s ecosystem.',
      ],
    },
  },
  {
    slug: "marketing-automation",
    title: "Marketing Automation",
    category: "Square • 2022",
    description:
      "Surfacing what guests order most — helping teams spot trends, adjust menus, and double down on what works.",
    images: [
      { src: "/assets/Marketing/Automation.png", alt: "Marketing automation" },
      { src: "/assets/Marketing/Design.png", alt: "Marketing design" },
    ],
    overview: {
      headline:
        "I designed automations and marketing tools that helped restaurants retain and acquire customers",
      goalsLabel: "Redesign Goals",
      goals: [
        "Turn order data into clear, timely signals teams can act on.",
        "Highlight top-performing items grounded in real guest behavior.",
        "Make it easier for merchants to respond with better menus and campaigns.",
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
