export interface CtaLink {
  label: string;
  href: string;
}

export const site = {
  name: "Machel Kassah",
  headline: "Operations and Compliance Professional building software solutions for real operational problems",
  positioningStatement:
    "I design practical digital systems, strengthen operational processes, and turn real business problems into working technology — spanning compliance, software development, and data.",
  heroCtaPrimary: { label: "View My Work", href: "/projects" } as CtaLink,
  heroCtaSecondary: { label: "Get in Touch", href: "#contact" } as CtaLink,
  about: {
    paragraphs: [
      "I work at the intersection of operations, compliance, and technology — building the systems that keep organizations running, and the software that makes running them easier.",
      "My background spans over a decade in service delivery, operations, and compliance, paired with hands-on software development experience. I don't just identify where a process breaks down — I design the workflow, build the application, deploy it, and analyze the data it produces to keep improving it.",
      "Outside of my core operations work, I run <strong>Enthrive</strong>, a branding and creative solutions business, and build software products through <strong>DeleOps</strong> — including <strong>Opsella</strong>, a point-of-sale and ERP platform I'm developing for small and growing businesses.",
      "I'm drawn to problems that sit between people, process, and technology — the kind that don't have a clean off-the-shelf answer.",
    ],
  },
};
