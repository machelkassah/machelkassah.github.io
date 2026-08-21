export interface ProjectImage {
  src: string;
  alt: string;
  guidance: string;
}

export type ProjectStatusState = "live" | "progress";

export function projectStatusState(status: string): ProjectStatusState {
  return status === "Live" ? "live" : "progress";
}

export interface Project {
  slug: string;
  name: string;
  status: string;
  flagship: boolean;
  featuredOnHome: boolean;
  description: string;
  problem?: string;
  solution?: string;
  role?: string;
  stack?: string[];
  image: ProjectImage;
}

export const projects: Project[] = [
  {
    slug: "daily-activity-log",
    name: "Daily Activity Log",
    status: "Live",
    flagship: false,
    featuredOnHome: true,
    description:
      "An operational reporting application for collecting and analyzing daily station-level activity across multiple offices.",
    problem: "Manual daily reporting made it difficult to monitor operations across stations in real time.",
    solution: "A role-based reporting platform with live dashboards, historical analysis, and performance tracking.",
    role: "Product design, database architecture, development, deployment",
    stack: ["AdonisJS", "MySQL", "Docker", "Tailwind CSS", "AWS Lightsail"],
    image: {
      src: "/images/projects/daily-activity-log.jpg",
      alt: "Main dashboard view showing the station monitoring/reporting UI, sample data only",
      guidance:
        "Main dashboard view showing the station monitoring/reporting UI. Use sample or dummy data — no real station names, transaction counts, or personal identifiers visible.",
    },
  },
  {
    slug: "incident-reporter",
    name: "Incident Reporter",
    status: "78% complete",
    flagship: false,
    featuredOnHome: false,
    description:
      "A mobile-first incident management platform with supervisor workflows, compliance oversight dashboards, and offline sync for field use.",
    image: {
      src: "/images/projects/incident-reporter.jpg",
      alt: "Incident submission form or supervisor dashboard view, real details scrubbed",
      guidance:
        "Incident submission form or supervisor dashboard view. Scrub any real incident details, names, or dates before uploading.",
    },
  },
  {
    slug: "gearhub",
    name: "GearHub",
    status: "70% complete",
    flagship: false,
    featuredOnHome: false,
    description:
      "A PPE requisition, inventory, and issuance management system covering employee tracking, purchasing, and reporting.",
    image: {
      src: "/images/projects/gearhub.jpg",
      alt: "Inventory or issuance screen, real employee names/IDs replaced with placeholders",
      guidance: "Inventory or issuance screen. Replace any real employee names/IDs with placeholders.",
    },
  },
  {
    slug: "opsella",
    name: "Opsella",
    status: "87% complete",
    flagship: true,
    featuredOnHome: true,
    description:
      "A point-of-sale and ERP platform covering inventory, sales, purchasing, and multi-branch operations — built with offline-first, multi-tenant SaaS architecture in mind. Flagship product-thinking project.",
    image: {
      src: "/images/projects/opsella.jpg",
      alt: "POS/ERP dashboard or sales screen, demo data",
      guidance:
        "POS/ERP dashboard or sales screen — ideally your most visually complete view, since this is the flagship project. Use demo data.",
    },
  },
  {
    slug: "dreamhome-cms",
    name: "DreamHome CMS and E-commerce Platform",
    status: "70% complete",
    flagship: false,
    featuredOnHome: false,
    description:
      "A custom web application built specifically for DreamHome GH to manage importation, pre-order management, and sales of goods — with full e-commerce features.",
    role: "Developer",
    stack: ["AdonisJS", "MySQL", "Docker", "Tailwind CSS"],
    image: {
      src: "/images/projects/dreamhome-cms.jpg",
      alt: "Customer-facing storefront or admin pre-order management view, client branding pending confirmation",
      guidance:
        "Customer-facing storefront or admin pre-order management view. Since this is client work, confirm with DreamHome GH before publishing any screenshot showing their branding or real product/customer data.",
    },
  },
];
