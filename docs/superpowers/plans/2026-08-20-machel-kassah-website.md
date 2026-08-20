# Machel Kassah Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the hybrid Astro site (single-scroll Home + dedicated `/projects` and `/ventures` pages) described in the design spec, with content transcribed verbatim from the copy file and image placeholders everywhere a real photo/screenshot is still pending.

**Architecture:** Astro static site (zero client-JS runtime shipped) with content in typed `src/data/*.ts` modules, presentational `src/components/*.astro` files, three routes (`src/pages/index.astro`, `projects.astro`, `ventures.astro`) sharing one `BaseLayout`. Tests use Vitest configured via `astro/config`'s `getViteConfig` so `.astro` files can be imported directly in tests and rendered to HTML strings with Astro's Container API (`astro/container`) for assertions — no browser or jsdom needed.

**Tech Stack:** Astro 7.2.4, Vitest 4.1.11, plain CSS (custom properties), no CSS/UI framework, no client JS beyond a CSS-only mobile nav toggle and one small fetch-based contact-form script.

**Spec:** `docs/superpowers/specs/2026-08-20-machel-kassah-website-design.md`

## Global Constraints

- Static site, no backend. Contact form posts to a placeholder Formspree endpoint (`https://formspree.io/f/YOUR_FORM_ID`).
- No phone number and no CV/résumé download anywhere on the site.
- All copy, dates, and figures come verbatim from `content/copy-source.md` (already in the repo). No invented facts, ventures, awards, or years. Bracketed/unresolved items in the copy file render as explicit placeholders (images) or are omitted, never invented.
- Light theme only. Colors: `--color-bg:#F6F1E7`, `--color-bg-alt:#EFE7D8`, `--color-ink:#211D19`, `--color-ink-muted:#5A5248`, `--color-accent:#C1531E`, `--color-accent-tint:#F0DCCB`.
- Fonts: **Fraunces** (headings), **Archivo** (body/UI), **IBM Plex Mono** (labels/metadata), via Google Fonts.
- Hybrid IA: `/` is a single scrolling page (Hero, About, Experience, Skills, Projects preview, Ventures preview, Leadership & Education, Contact); `/projects` and `/ventures` are dedicated pages with the full, expanded treatment.
- Every image slot is a placeholder (dashed border, guidance text, correct aspect ratio — 4:5 portraits, 16:9 project screenshots) until a real file is dropped at its named path in `public/images/`.
- Accessible: alt text (or `aria-label`) on every image slot, one `<h1>` per page, keyboard-navigable nav and form, visible focus states, mobile-first responsive down to 375px.
- Astro's plain-text `{expression}` interpolation HTML-escapes `&` to `&amp;` (verified empirically); `set:html` renders raw markup unescaped. Test assertions below rely on this.

---

### Task 1: Project scaffold & tooling

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/pages/index.astro` (temporary placeholder — replaced in Task 12)
- Create: `tests/scaffold.test.ts`

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` / `npm test` pipeline that every later task builds on.

- [ ] **Step 1: Write package.json**

```json
{
  "name": "machel-kassah-website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "7.2.4"
  },
  "devDependencies": {
    "vitest": "4.1.11"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/astro` and `node_modules/vitest` exist, exit code 0.

- [ ] **Step 3: Write astro.config.mjs**

```js
import { defineConfig } from "astro/config";

// No `site` set yet — add `site: "https://your-domain.example"` once a
// domain is chosen, so canonical/OG URLs can be made absolute.
export default defineConfig({});
```

- [ ] **Step 4: Write tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Write vitest.config.ts**

```ts
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 6: Write the placeholder home page**

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Machel Kassah</title>
  </head>
  <body>
    <p>Coming soon</p>
  </body>
</html>
```

Save as `src/pages/index.astro`.

- [ ] **Step 7: Write the failing scaffold test**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import IndexPage from "../src/pages/index.astro";

describe("project scaffold", () => {
  it("renders the placeholder home page", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IndexPage);
    expect(result).toContain("Coming soon");
  });
});
```

Save as `tests/scaffold.test.ts`.

- [ ] **Step 8: Run the test**

Run: `npm test`
Expected: `tests/scaffold.test.ts` passes (1 test).

- [ ] **Step 9: Verify the build pipeline**

Run: `npm run build`
Expected: exits 0, `dist/index.html` exists and contains `Coming soon`.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src/pages/index.astro tests/scaffold.test.ts
git commit -m "Scaffold Astro project with Vitest + Container API test pipeline"
```

---

### Task 2: Global design tokens & base styles

**Files:**
- Create: `src/styles/global.css`
- Create: `tests/styles.test.ts`

**Interfaces:**
- Produces: CSS custom properties (`--color-bg`, `--color-bg-alt`, `--color-ink`, `--color-ink-muted`, `--color-accent`, `--color-accent-tint`, `--font-display`, `--font-body`, `--font-mono`, `--space-1`..`--space-6`, `--radius`, `--max-width`) and utility classes (`.section`, `.section--alt`, `.container`, `.label`, `.btn`, `.btn--primary`, `.btn--secondary`, `.reveal`, `.reveal-1`..`.reveal-4`) that every later component task relies on by name.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf-8");

describe("design tokens", () => {
  it("defines the spec color palette", () => {
    expect(css).toContain("--color-bg: #F6F1E7");
    expect(css).toContain("--color-bg-alt: #EFE7D8");
    expect(css).toContain("--color-ink: #211D19");
    expect(css).toContain("--color-ink-muted: #5A5248");
    expect(css).toContain("--color-accent: #C1531E");
    expect(css).toContain("--color-accent-tint: #F0DCCB");
  });

  it("defines the spec font stack variables", () => {
    expect(css).toContain('--font-display: "Fraunces"');
    expect(css).toContain('--font-body: "Archivo"');
    expect(css).toContain('--font-mono: "IBM Plex Mono"');
  });

  it("respects prefers-reduced-motion", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("defines the reveal animation utility classes", () => {
    expect(css).toContain(".reveal-1");
    expect(css).toContain(".reveal-4");
    expect(css).toContain("@keyframes reveal-up");
  });
});
```

Save as `tests/styles.test.ts`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/styles.test.ts`
Expected: FAIL — `src/styles/global.css` does not exist.

- [ ] **Step 3: Write global.css**

```css
:root {
  --color-bg: #F6F1E7;
  --color-bg-alt: #EFE7D8;
  --color-ink: #211D19;
  --color-ink-muted: #5A5248;
  --color-accent: #C1531E;
  --color-accent-tint: #F0DCCB;
  --color-border: rgba(33, 29, 25, 0.12);

  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Archivo", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: 6rem;

  --radius: 4px;
  --max-width: 72rem;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background-color: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.1;
  margin: 0 0 var(--space-2);
}

h1 { font-size: clamp(2.5rem, 5vw + 1rem, 5rem); }
h2 { font-size: clamp(1.75rem, 2.5vw + 1rem, 2.75rem); }
h3 { font-size: clamp(1.25rem, 1.5vw + 1rem, 1.75rem); }

p { margin: 0 0 var(--space-2); }

a {
  color: var(--color-accent);
}

.section {
  padding: var(--space-6) var(--space-2);
}

.section--alt {
  background-color: var(--color-bg-alt);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
}

.label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}

.btn {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  text-decoration: none;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.btn--primary {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

.btn--primary:hover {
  transform: translateY(-2px);
}

.btn--secondary {
  border: 1px solid var(--color-ink);
  color: var(--color-ink);
}

.btn--secondary:hover {
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  animation: reveal-up 0.6s ease both;
}

.reveal-1 { animation-delay: 0.05s; }
.reveal-2 { animation-delay: 0.2s; }
.reveal-3 { animation-delay: 0.35s; }
.reveal-4 { animation-delay: 0.5s; }
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/styles.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css tests/styles.test.ts
git commit -m "Add design tokens and base styles"
```

---

### Task 3: Content data layer

**Files:**
- Create: `src/data/site.ts`
- Create: `src/data/images.ts`
- Create: `src/data/experience.ts`
- Create: `src/data/skills.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/ventures.ts`
- Create: `src/data/leadership.ts`
- Create: `src/data/education.ts`
- Create: `src/data/contact.ts`
- Create: `tests/data.test.ts`

**Interfaces:**
- Produces: `site: { name, headline, positioningStatement, heroCtaPrimary: {label,href}, heroCtaSecondary: {label,href}, about: { paragraphs: string[] } }`; `heroImage`, `aboutSecondaryImage: { src, alt, guidance, aspect }`; `experience: { company, role, dates, bullets: string[] }[]`; `skills: { category, items: string[] }[]`; `projects: { slug, name, status, flagship, featuredOnHome, description, problem?, solution?, role?, stack?: string[], image: {src,alt,guidance} }[]`; `ventures: { slug, name, description }[]`; `leadership: string[]`; `education: { credential, institution }[]`, `certifications: string[]`; `contact: { personalEmail, businessEmail, linkedin, github, location, responseNote, formEndpoint }`. Every later component task imports from these modules by these exact names.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { site } from "../src/data/site";
import { heroImage, aboutSecondaryImage } from "../src/data/images";
import { experience } from "../src/data/experience";
import { skills } from "../src/data/skills";
import { projects } from "../src/data/projects";
import { ventures } from "../src/data/ventures";
import { leadership } from "../src/data/leadership";
import { education, certifications } from "../src/data/education";
import { contact } from "../src/data/contact";

describe("site data", () => {
  it("matches the copy file's name, headline, and positioning statement", () => {
    expect(site.name).toBe("Machel Kassah");
    expect(site.headline).toBe("Operations Technologist & Digital Systems Builder");
    expect(site.positioningStatement).toBe(
      "I design practical digital systems, strengthen operational processes, and turn real business problems into working technology — spanning compliance, software development, and data."
    );
  });

  it("has the two hero CTAs from the copy file", () => {
    expect(site.heroCtaPrimary).toEqual({ label: "View My Work", href: "/projects" });
    expect(site.heroCtaSecondary).toEqual({ label: "Get in Touch", href: "#contact" });
  });

  it("has exactly the 4 About paragraphs from the copy file, in order, with Enthrive/DeleOps/Opsella emphasized", () => {
    expect(site.about.paragraphs).toHaveLength(4);
    expect(site.about.paragraphs[0]).toContain("intersection of operations, compliance, and technology");
    expect(site.about.paragraphs[2]).toContain("<strong>Enthrive</strong>");
    expect(site.about.paragraphs[2]).toContain("<strong>DeleOps</strong>");
    expect(site.about.paragraphs[2]).toContain("<strong>Opsella</strong>");
    expect(site.about.paragraphs[3]).toContain("drawn to problems that sit between people, process, and technology");
  });
});

describe("site images", () => {
  it("defines the hero portrait placeholder at 4:5 with the copy file's guidance", () => {
    expect(heroImage.aspect).toBe("4/5");
    expect(heroImage.src).toBe("/images/hero-portrait.jpg");
    expect(heroImage.guidance).toContain("Professional headshot, front-facing");
  });

  it("defines the secondary About photo placeholder", () => {
    expect(aboutSecondaryImage.aspect).toBe("4/5");
    expect(aboutSecondaryImage.src).toBe("/images/about-secondary.jpg");
    expect(aboutSecondaryImage.guidance).toContain("candid, working-context shot");
  });
});

describe("experience data", () => {
  it("has all 5 roles in reverse chronological order", () => {
    expect(experience).toHaveLength(5);
    expect(experience.map((e) => e.company)).toEqual([
      "Ghana Link Network Services",
      "Hekimax Solutions Ltd",
      "Hekimax Solutions Ltd",
      "Hekimax Solutions Ltd",
      "University of Education, Winneba",
    ]);
    expect(experience.map((e) => e.role)).toEqual([
      "Safety and Compliance Officer",
      "Operations Lead",
      "Technical Support Manager",
      "Sales & Customer Support Technician",
      "Teaching Assistant",
    ]);
    expect(experience.map((e) => e.dates)).toEqual([
      "2025 – Present",
      "2022 – 2025",
      "2018 – 2022",
      "2014 – 2018",
      "2012 – 2014",
    ]);
  });

  it("has the current role's 4 bullets verbatim", () => {
    expect(experience[0].bullets).toEqual([
      "Monitor compliance across operational stations and track incident and risk reporting",
      "Design and maintain internal reporting systems for management visibility",
      "Analyze operational data to identify performance and process issues",
      "Lead development of internal tools to replace manual tracking processes",
    ]);
  });

  it("has no phone numbers or CV references anywhere in the data", () => {
    const json = JSON.stringify(experience).toLowerCase();
    expect(json).not.toMatch(/resume|cv download|\+233|phone/);
  });
});

describe("skills data", () => {
  it("has all 5 categories in the copy file's order", () => {
    expect(skills.map((s) => s.category)).toEqual([
      "Operations & Compliance",
      "Software Development",
      "Infrastructure & Deployment",
      "Digital & Creative",
      "Business & Leadership",
    ]);
  });

  it("has the exact item count per category from the copy file", () => {
    const counts = Object.fromEntries(skills.map((s) => [s.category, s.items.length]));
    expect(counts).toEqual({
      "Operations & Compliance": 8,
      "Software Development": 11,
      "Infrastructure & Deployment": 5,
      "Digital & Creative": 5,
      "Business & Leadership": 5,
    });
  });

  it("includes the Infrastructure item with an ampersand verbatim in the data", () => {
    expect(skills[2].items).toContain("Web server & domain configuration");
  });
});

describe("projects data", () => {
  it("has all 5 projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("marks Opsella as the sole flagship, featured on Home", () => {
    const flagship = projects.filter((p) => p.flagship);
    expect(flagship).toHaveLength(1);
    expect(flagship[0].slug).toBe("opsella");
    expect(flagship[0].featuredOnHome).toBe(true);
  });

  it("features exactly Opsella and Daily Activity Log on Home", () => {
    const featured = projects.filter((p) => p.featuredOnHome).map((p) => p.slug).sort();
    expect(featured).toEqual(["daily-activity-log", "opsella"]);
  });

  it("has the exact status strings from the copy file", () => {
    const statuses = Object.fromEntries(projects.map((p) => [p.slug, p.status]));
    expect(statuses).toEqual({
      "daily-activity-log": "Live",
      "incident-reporter": "78% complete",
      gearhub: "70% complete",
      opsella: "87% complete",
      "dreamhome-cms": "70% complete",
    });
  });

  it("gives every project a 16:9-ready image placeholder with copy-file guidance text", () => {
    for (const project of projects) {
      expect(project.image.src).toMatch(/^\/images\/projects\/.+\.jpg$/);
      expect(project.image.guidance.length).toBeGreaterThan(0);
    }
  });

  it("only Daily Activity Log and DreamHome CMS carry role/stack, per the copy file", () => {
    const withRole = projects.filter((p) => p.role).map((p) => p.slug).sort();
    expect(withRole).toEqual(["daily-activity-log", "dreamhome-cms"]);
  });
});

describe("ventures data", () => {
  it("has exactly the 3 ventures from the copy file, no more", () => {
    expect(ventures).toHaveLength(3);
    expect(ventures.map((v) => v.name)).toEqual(["Enthrive", "DeleOps", "Opsella"]);
  });
});

describe("leadership data", () => {
  it("has the 2 items from the copy file", () => {
    expect(leadership).toEqual([
      "Volunteer, Google Developer Conference, Ghana 2025",
      "Member, Linux Accra User Group",
    ]);
  });
});

describe("education data", () => {
  it("has the 3 degrees from the copy file, without invented years", () => {
    expect(education).toHaveLength(3);
    for (const degree of education) {
      expect(degree.credential).not.toMatch(/\d{4}/);
    }
    expect(education[0]).toEqual({ credential: "MSc Computer Science", institution: "University of Ghana, Legon" });
  });

  it("has the 3 certifications from the copy file", () => {
    expect(certifications).toEqual([
      "Microsoft Technology Associate",
      "GI-KACE Data Science Certificate",
      "GI-KACE Data Analysis with Python Certificate",
    ]);
  });
});

describe("contact data", () => {
  it("has both emails labeled correctly", () => {
    expect(contact.personalEmail).toBe("machelkassah@gmail.com");
    expect(contact.businessEmail).toBe("deleoperations@gmail.com");
  });

  it("has no phone number field", () => {
    expect(contact).not.toHaveProperty("phone");
  });

  it("has a placeholder Formspree endpoint clearly marked for replacement", () => {
    expect(contact.formEndpoint).toBe("https://formspree.io/f/YOUR_FORM_ID");
  });
});
```

Save as `tests/data.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/data.test.ts`
Expected: FAIL — none of the `src/data/*.ts` modules exist yet.

- [ ] **Step 3: Write src/data/site.ts**

```ts
export interface CtaLink {
  label: string;
  href: string;
}

export const site = {
  name: "Machel Kassah",
  headline: "Operations Technologist & Digital Systems Builder",
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
```

- [ ] **Step 4: Write src/data/images.ts**

```ts
export interface ImageSlot {
  src: string;
  alt: string;
  guidance: string;
  aspect: string;
}

export const heroImage: ImageSlot = {
  src: "/images/hero-portrait.jpg",
  alt: "Professional headshot of Machel Kassah, front-facing, neutral background",
  guidance:
    "Professional headshot, front-facing, neutral or softly blurred background, good lighting. Suggested crop: square or 4:5 portrait, at least 1200px on the short side.",
  aspect: "4/5",
};

export const aboutSecondaryImage: ImageSlot = {
  src: "/images/about-secondary.jpg",
  alt: "Candid working-context photo of Machel Kassah, at a desk, at a station, or presenting",
  guidance:
    "A more candid, working-context shot — at a desk, at a station, or presenting — to add texture beyond the hero headshot.",
  aspect: "4/5",
};
```

- [ ] **Step 5: Write src/data/experience.ts**

```ts
export interface ExperienceEntry {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Ghana Link Network Services",
    role: "Safety and Compliance Officer",
    dates: "2025 – Present",
    bullets: [
      "Monitor compliance across operational stations and track incident and risk reporting",
      "Design and maintain internal reporting systems for management visibility",
      "Analyze operational data to identify performance and process issues",
      "Lead development of internal tools to replace manual tracking processes",
    ],
  },
  {
    company: "Hekimax Solutions Ltd",
    role: "Operations Lead",
    dates: "2022 – 2025",
    bullets: [
      "Led operational and strategic initiatives across the organization",
      "Oversaw the launch of the Yesoko website and mobile applications",
      "Improved technical support operations and trained support technicians",
      "Managed supplier relationships and implemented server monitoring for improved reliability",
    ],
  },
  {
    company: "Hekimax Solutions Ltd",
    role: "Technical Support Manager",
    dates: "2018 – 2022",
    bullets: [],
  },
  {
    company: "Hekimax Solutions Ltd",
    role: "Sales & Customer Support Technician",
    dates: "2014 – 2018",
    bullets: [],
  },
  {
    company: "University of Education, Winneba",
    role: "Teaching Assistant",
    dates: "2012 – 2014",
    bullets: [],
  },
];
```

- [ ] **Step 6: Write src/data/skills.ts**

```ts
export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Operations & Compliance",
    items: [
      "Compliance monitoring",
      "Operational risk management",
      "Incident management",
      "Process improvement",
      "Workflow design",
      "Performance monitoring",
      "SOP implementation",
      "Management reporting",
    ],
  },
  {
    category: "Software Development",
    items: [
      "AdonisJS",
      "JavaScript",
      "HTML/CSS",
      "Tailwind CSS",
      "MySQL",
      "Docker",
      "Redis",
      "Google Apps Script",
      "Chart.js",
      "Role-based access control",
      "Offline-first application design",
    ],
  },
  {
    category: "Infrastructure & Deployment",
    items: [
      "AWS Lightsail",
      "Linux",
      "Docker deployment",
      "Web server & domain configuration",
      "Database administration",
    ],
  },
  {
    category: "Digital & Creative",
    items: ["Graphic design", "Branding", "Web design", "Video production", "Social media & digital marketing"],
  },
  {
    category: "Business & Leadership",
    items: [
      "Entrepreneurship",
      "Project planning",
      "Business process design",
      "Team coordination",
      "Customer service leadership",
    ],
  },
];
```

- [ ] **Step 7: Write src/data/projects.ts**

```ts
export interface ProjectImage {
  src: string;
  alt: string;
  guidance: string;
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
```

- [ ] **Step 8: Write src/data/ventures.ts**

```ts
export interface Venture {
  slug: string;
  name: string;
  description: string;
}

export const ventures: Venture[] = [
  {
    slug: "enthrive",
    name: "Enthrive",
    description: "Corporate branding, merchandise, and creative/media services based in Ghana.",
  },
  {
    slug: "deleops",
    name: "DeleOps",
    description: "Software engineering and technology products, including internal business systems and Opsella.",
  },
  {
    slug: "opsella",
    name: "Opsella",
    description: "A POS and ERP platform for small and growing businesses.",
  },
];
```

- [ ] **Step 9: Write src/data/leadership.ts**

```ts
export const leadership: string[] = [
  "Volunteer, Google Developer Conference, Ghana 2025",
  "Member, Linux Accra User Group",
];
```

- [ ] **Step 10: Write src/data/education.ts**

```ts
export interface Degree {
  credential: string;
  institution: string;
}

export const education: Degree[] = [
  { credential: "MSc Computer Science", institution: "University of Ghana, Legon" },
  { credential: "BSc Information Technology Education", institution: "University of Education, Winneba" },
  { credential: "Certificate in Information Technology", institution: "Ghana Telecom University College" },
];

export const certifications: string[] = [
  "Microsoft Technology Associate",
  "GI-KACE Data Science Certificate",
  "GI-KACE Data Analysis with Python Certificate",
];
```

- [ ] **Step 11: Write src/data/contact.ts**

```ts
export const contact = {
  personalEmail: "machelkassah@gmail.com",
  businessEmail: "deleoperations@gmail.com",
  linkedin: "https://linkedin.com/in/machelkassah",
  github: "https://github.com/machelkassah",
  location: "Accra, Ghana",
  responseNote:
    "Prefer to reach out directly? Use the form below or email — I typically respond within 1–2 business days.",
  // Replace YOUR_FORM_ID with the real Formspree form ID before launch.
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};
```

- [ ] **Step 12: Run the tests to verify they pass**

Run: `npm test -- tests/data.test.ts`
Expected: PASS (all tests).

- [ ] **Step 13: Commit**

```bash
git add src/data tests/data.test.ts
git commit -m "Add content data layer transcribed from copy-source.md"
```

---

### Task 4: ImagePlaceholder component

**Files:**
- Create: `src/components/ImagePlaceholder.astro`
- Create: `tests/image-placeholder.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks except the CSS custom properties from Task 2 (`--space-2`, `--radius`, `--color-border`, `--color-bg-alt`, `--font-mono`, `--color-ink-muted`).
- Produces: `<ImagePlaceholder src alt guidance aspect class? />` — used by Hero, About, ProjectsPreview, ProjectsFull in later tasks.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve, join } from "node:path";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ImagePlaceholder from "../src/components/ImagePlaceholder.astro";

describe("ImagePlaceholder", () => {
  it("renders a dashed placeholder box with the guidance text when no real image exists", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ImagePlaceholder, {
      props: {
        src: "/images/does-not-exist.jpg",
        alt: "Test alt text",
        guidance: "Test guidance copy",
        aspect: "16/9",
      },
    });
    expect(result).toContain("Test guidance copy");
    expect(result).toContain('aria-label="Test alt text"');
    expect(result).toContain("aspect-ratio: 16/9");
  });

  it("renders a real <img> when a file exists at the swap path", async () => {
    const dir = resolve(process.cwd(), "public/images");
    mkdirSync(dir, { recursive: true });
    const filePath = join(dir, "test-swap.jpg");
    writeFileSync(filePath, "");
    try {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ImagePlaceholder, {
        props: {
          src: "/images/test-swap.jpg",
          alt: "Swapped alt",
          guidance: "unused",
          aspect: "4/5",
        },
      });
      expect(result).toContain('src="/images/test-swap.jpg"');
      expect(result).toContain('alt="Swapped alt"');
    } finally {
      unlinkSync(filePath);
    }
  });
});
```

Save as `tests/image-placeholder.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/image-placeholder.test.ts`
Expected: FAIL — `src/components/ImagePlaceholder.astro` does not exist.

- [ ] **Step 3: Write the component**

```astro
---
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface Props {
  src: string;
  alt: string;
  guidance: string;
  aspect: string;
  class?: string;
}

const { src, alt, guidance, aspect, class: className } = Astro.props;

const publicPath = fileURLToPath(new URL(`../../public${src}`, import.meta.url));
const hasRealImage = existsSync(publicPath);
---

{hasRealImage ? (
  <img src={src} alt={alt} class={`img-real ${className ?? ""}`} style={`aspect-ratio: ${aspect};`} loading="lazy" />
) : (
  <div class={`img-placeholder ${className ?? ""}`} style={`aspect-ratio: ${aspect};`} role="img" aria-label={alt}>
    <p class="img-placeholder__guidance">{guidance}</p>
  </div>
)}

<style>
  .img-real {
    display: block;
    width: 100%;
    object-fit: cover;
    border-radius: var(--radius);
  }

  .img-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--space-2);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius);
    background-color: var(--color-bg-alt);
    text-align: center;
  }

  .img-placeholder__guidance {
    margin: 0;
    max-width: 32ch;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.02em;
    color: var(--color-ink-muted);
  }
</style>
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/image-placeholder.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ImagePlaceholder.astro tests/image-placeholder.test.ts
git commit -m "Add ImagePlaceholder component with automatic real-image swap"
```

---

### Task 5: BaseLayout, Header, and Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `public/favicon.svg`
- Create: `tests/layout.test.ts`

**Interfaces:**
- Consumes: `contact` and `site` from Task 3's data modules; `global.css` from Task 2.
- Produces: `<BaseLayout title description currentPath?><slot/></BaseLayout>` and `<Header currentPath? />` / `<Footer />`, used by every page in Tasks 8, 9, and 12.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Header from "../src/components/Header.astro";
import Footer from "../src/components/Footer.astro";
import BaseLayout from "../src/layouts/BaseLayout.astro";

describe("Header", () => {
  it("links About/Experience/Skills/Contact to Home anchors and Projects/Ventures to their own pages", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header, { props: {} });
    expect(result).toContain('href="/#about"');
    expect(result).toContain('href="/#experience"');
    expect(result).toContain('href="/#skills"');
    expect(result).toContain('href="/#contact"');
    expect(result).toContain('href="/projects"');
    expect(result).toContain('href="/ventures"');
  });

  it("marks the current page active via aria-current", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header, { props: { currentPath: "/projects" } });
    expect(result).toContain('aria-current="page"');
  });
});

describe("Footer", () => {
  it("shows the personal email, LinkedIn, GitHub, and location, and no phone number", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer);
    expect(result).toContain("machelkassah@gmail.com");
    expect(result).toContain("linkedin.com/in/machelkassah");
    expect(result).toContain("github.com/machelkassah");
    expect(result).toContain("Accra, Ghana");
    expect(result.toLowerCase()).not.toMatch(/\+233|tel:/);
  });
});

describe("BaseLayout", () => {
  it("renders the page title, meta description, and OG tags from props", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      props: { title: "Test Title", description: "Test description" },
      slots: { default: "<p>Body content</p>" },
    });
    expect(result).toContain("<title>Test Title</title>");
    expect(result).toContain('content="Test description"');
    expect(result).toContain('property="og:title"');
    expect(result).toContain("Body content");
  });

  it("never renders a CV/résumé download link", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      props: { title: "t", description: "d" },
      slots: { default: "<p>x</p>" },
    });
    expect(result.toLowerCase()).not.toMatch(/resume|cv\.pdf|download.{0,10}cv/);
  });
});
```

Save as `tests/layout.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/layout.test.ts`
Expected: FAIL — none of the three components exist.

- [ ] **Step 3: Write src/components/Header.astro**

```astro
---
export interface Props {
  currentPath?: string;
}
const { currentPath = "/" } = Astro.props;

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
  { label: "Ventures", href: "/ventures" },
  { label: "Contact", href: "/#contact" },
];
---

<header class="site-header">
  <div class="site-header__inner container">
    <a href="/" class="site-header__name">Machel Kassah</a>
    <nav aria-label="Primary">
      <ul class="site-header__nav">
        {navItems.map((item) => (
          <li>
            <a
              href={item.href}
              class="site-header__link"
              aria-current={
                (item.href === "/projects" && currentPath === "/projects") ||
                (item.href === "/ventures" && currentPath === "/ventures")
                  ? "page"
                  : undefined
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .site-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2);
  }

  .site-header__name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--color-ink);
    text-decoration: none;
  }

  .site-header__nav {
    display: flex;
    gap: var(--space-3);
    list-style: none;
    margin: 0;
    padding: 0;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .site-header__link {
    color: var(--color-ink);
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
  }

  .site-header__link:hover,
  .site-header__link[aria-current="page"] {
    border-bottom-color: var(--color-accent);
    color: var(--color-accent);
  }

  @media (max-width: 640px) {
    .site-header__nav {
      gap: var(--space-2);
      flex-wrap: wrap;
    }
  }
</style>
```

- [ ] **Step 4: Write src/components/Footer.astro**

```astro
---
import { contact } from "../data/contact";
import { site } from "../data/site";
---

<footer class="site-footer">
  <div class="container site-footer__inner">
    <p class="site-footer__name">{site.name}</p>
    <ul class="site-footer__links">
      <li><a href={`mailto:${contact.personalEmail}`}>{contact.personalEmail}</a></li>
      <li><a href={contact.linkedin}>{contact.linkedin.replace("https://", "")}</a></li>
      <li><a href={contact.github}>{contact.github.replace("https://", "")}</a></li>
      <li>{contact.location}</li>
    </ul>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--color-border);
    padding: var(--space-3) 0;
  }

  .site-footer__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-ink-muted);
  }

  .site-footer__name {
    margin: 0;
  }

  .site-footer__links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .site-footer__links a {
    color: var(--color-ink-muted);
  }
</style>
```

- [ ] **Step 5: Write public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#211D19"/>
  <text x="16" y="21" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#F6F1E7">MK</text>
</svg>
```

- [ ] **Step 6: Write src/layouts/BaseLayout.astro**

```astro
---
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

export interface Props {
  title: string;
  description: string;
  currentPath?: string;
}

const { title, description, currentPath = "/" } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Archivo:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <Header currentPath={currentPath} />
    <slot />
    <Footer />
  </body>
</html>
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test -- tests/layout.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 8: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Header.astro src/components/Footer.astro public/favicon.svg tests/layout.test.ts
git commit -m "Add BaseLayout, Header, and Footer"
```

---

### Task 6: Hero and About

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/About.astro`
- Create: `tests/hero-about.test.ts`

**Interfaces:**
- Consumes: `site`, `heroImage`, `aboutSecondaryImage` (Task 3); `ImagePlaceholder` (Task 4).
- Produces: `<Hero />` (renders `id="home"`), `<About />` (renders `id="about"`), used by `src/pages/index.astro` in Task 12.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Hero from "../src/components/Hero.astro";
import About from "../src/components/About.astro";

describe("Hero", () => {
  it("renders name, headline, positioning statement, and both CTAs", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain('id="home"');
    expect(result).toContain("Machel Kassah");
    expect(result).toContain("Operations Technologist");
    expect(result).toContain("Digital Systems Builder");
    expect(result).toContain("I design practical digital systems");
    expect(result).toContain(">View My Work<");
    expect(result).toContain(">Get in Touch<");
    expect(result).toContain('href="/projects"');
    expect(result).toContain('href="#contact"');
  });

  it("includes the hero portrait placeholder", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain("Professional headshot, front-facing");
    expect(result).toContain("aspect-ratio: 4/5");
  });
});

describe("About", () => {
  it("has id=about and renders all 4 paragraphs with Enthrive/DeleOps/Opsella emphasized", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(About);
    expect(result).toContain('id="about"');
    expect(result).toContain("intersection of operations, compliance, and technology");
    expect(result).toContain("<strong>Enthrive</strong>");
    expect(result).toContain("<strong>DeleOps</strong>");
    expect(result).toContain("<strong>Opsella</strong>");
    expect(result).toContain("drawn to problems that sit between people, process, and technology");
  });

  it("includes the secondary photo placeholder", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(About);
    expect(result).toContain("candid, working-context shot");
  });
});
```

Save as `tests/hero-about.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/hero-about.test.ts`
Expected: FAIL — neither component exists.

- [ ] **Step 3: Write src/components/Hero.astro**

```astro
---
import { site } from "../data/site";
import { heroImage } from "../data/images";
import ImagePlaceholder from "./ImagePlaceholder.astro";
---

<section id="home" class="hero section">
  <div class="container hero__grid">
    <div class="hero__copy reveal reveal-1">
      <p class="label">{site.headline}</p>
      <h1 class="hero__name reveal reveal-2">{site.name}</h1>
      <p class="hero__positioning reveal reveal-3">{site.positioningStatement}</p>
      <div class="hero__ctas reveal reveal-4">
        <a class="btn btn--primary" href={site.heroCtaPrimary.href}>{site.heroCtaPrimary.label}</a>
        <a class="btn btn--secondary" href={site.heroCtaSecondary.href}>{site.heroCtaSecondary.label}</a>
      </div>
    </div>
    <div class="hero__portrait reveal reveal-2">
      <ImagePlaceholder
        src={heroImage.src}
        alt={heroImage.alt}
        guidance={heroImage.guidance}
        aspect={heroImage.aspect}
      />
    </div>
  </div>
</section>

<style>
  .hero__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: var(--space-5);
    align-items: center;
  }

  .hero__name {
    margin: var(--space-1) 0 var(--space-3);
  }

  .hero__positioning {
    max-width: 42ch;
    font-size: 1.1rem;
  }

  .hero__ctas {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-3);
  }

  .hero__portrait {
    max-width: 22rem;
    margin-left: auto;
  }

  @media (max-width: 800px) {
    .hero__grid {
      grid-template-columns: 1fr;
    }
    .hero__portrait {
      margin: 0 auto;
      order: -1;
    }
  }
</style>
```

- [ ] **Step 4: Write src/components/About.astro**

```astro
---
import { site } from "../data/site";
import { aboutSecondaryImage } from "../data/images";
import ImagePlaceholder from "./ImagePlaceholder.astro";
---

<section id="about" class="about section">
  <div class="container about__grid">
    <div class="about__copy">
      <h2>About</h2>
      {site.about.paragraphs.map((paragraph) => (
        <p set:html={paragraph} />
      ))}
    </div>
    <div class="about__photo">
      <ImagePlaceholder
        src={aboutSecondaryImage.src}
        alt={aboutSecondaryImage.alt}
        guidance={aboutSecondaryImage.guidance}
        aspect={aboutSecondaryImage.aspect}
      />
    </div>
  </div>
</section>

<style>
  .about__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-5);
    align-items: start;
  }

  .about__photo {
    max-width: 20rem;
  }

  @media (max-width: 800px) {
    .about__grid {
      grid-template-columns: 1fr;
    }
    .about__photo {
      max-width: 16rem;
      margin: 0 auto;
    }
  }
</style>
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- tests/hero-about.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/components/About.astro tests/hero-about.test.ts
git commit -m "Add Hero and About sections"
```

---

### Task 7: Experience and Skills

**Files:**
- Create: `src/components/Experience.astro`
- Create: `src/components/Skills.astro`
- Create: `tests/experience-skills.test.ts`

**Interfaces:**
- Consumes: `experience`, `skills` (Task 3).
- Produces: `<Experience />` (`id="experience"`), `<Skills />` (`id="skills"`), used by `src/pages/index.astro` in Task 12.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Experience from "../src/components/Experience.astro";
import Skills from "../src/components/Skills.astro";

describe("Experience", () => {
  it("renders all 5 roles as a reverse-chronological timeline", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience);
    expect(result).toContain('id="experience"');
    expect(result).toContain("Ghana Link Network Services");
    expect(result).toContain("Safety and Compliance Officer");
    expect(result).toContain("2025 – Present");
    expect(result).toContain("Sales &amp; Customer Support Technician");
    expect(result.indexOf("Safety and Compliance Officer")).toBeLessThan(result.indexOf("Teaching Assistant"));
  });

  it("renders the current role's bullets and omits an empty bullet list for older roles", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience);
    expect(result).toContain("Monitor compliance across operational stations and track incident and risk reporting");
  });
});

describe("Skills", () => {
  it("renders all 5 categories with an ampersand-containing category rendered correctly", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Skills);
    expect(result).toContain('id="skills"');
    expect(result).toContain("Operations &amp; Compliance");
    expect(result).toContain("Business &amp; Leadership");
    expect(result).toContain("Infrastructure &amp; Deployment");
  });

  it("renders an item that itself contains an ampersand", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Skills);
    expect(result).toContain("Web server &amp; domain configuration");
  });
});
```

Save as `tests/experience-skills.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/experience-skills.test.ts`
Expected: FAIL — neither component exists.

- [ ] **Step 3: Write src/components/Experience.astro**

```astro
---
import { experience } from "../data/experience";
---

<section id="experience" class="experience section section--alt">
  <div class="container">
    <h2>Experience</h2>
    <ol class="timeline">
      {experience.map((entry) => (
        <li class="timeline__item">
          <div class="timeline__marker" aria-hidden="true"></div>
          <div class="timeline__content">
            <p class="label">{entry.dates}</p>
            <h3>{entry.role}</h3>
            <p class="timeline__company">{entry.company}</p>
            {entry.bullets.length > 0 && (
              <ul class="timeline__bullets">
                {entry.bullets.map((bullet) => <li>{bullet}</li>)}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
  .timeline {
    list-style: none;
    margin: var(--space-3) 0 0;
    padding: 0;
    border-left: 2px solid var(--color-border);
  }

  .timeline__item {
    position: relative;
    padding: 0 0 var(--space-4) var(--space-3);
  }

  .timeline__marker {
    position: absolute;
    left: -7px;
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-accent);
  }

  .timeline__company {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--color-ink-muted);
    margin: 0 0 var(--space-2);
  }

  .timeline__bullets {
    margin: 0;
    padding-left: 1.1rem;
  }
</style>
```

- [ ] **Step 4: Write src/components/Skills.astro**

```astro
---
import { skills } from "../data/skills";
---

<section id="skills" class="skills section">
  <div class="container">
    <h2>Skills</h2>
    <div class="skills__grid">
      {skills.map((group) => (
        <div class="skills__group">
          <p class="label">{group.category}</p>
          <ul class="skills__items">
            {group.items.map((item) => <li>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .skills__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--space-4);
    margin-top: var(--space-3);
  }

  .skills__items {
    list-style: none;
    margin: var(--space-1) 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.6rem;
  }

  .skills__items li {
    font-size: 0.9rem;
  }

  .skills__items li:not(:last-child)::after {
    content: "·";
    margin-left: 0.6rem;
    color: var(--color-ink-muted);
  }
</style>
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- tests/experience-skills.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/Experience.astro src/components/Skills.astro tests/experience-skills.test.ts
git commit -m "Add Experience timeline and Skills sections"
```

---

### Task 8: Projects (preview, full page, route)

**Files:**
- Create: `src/components/ProjectsPreview.astro`
- Create: `src/components/ProjectsFull.astro`
- Create: `src/pages/projects.astro`
- Create: `tests/projects.test.ts`

**Interfaces:**
- Consumes: `projects` (Task 3), `ImagePlaceholder` (Task 4), `BaseLayout` (Task 5).
- Produces: `<ProjectsPreview />` (`id="projects"`, used on Home in Task 12), `<ProjectsFull />` (used by this task's `/projects` page).

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ProjectsPreview from "../src/components/ProjectsPreview.astro";
import ProjectsFull from "../src/components/ProjectsFull.astro";
import ProjectsPage from "../src/pages/projects.astro";

describe("ProjectsPreview (Home)", () => {
  it("shows exactly Opsella and Daily Activity Log, Opsella first, with a link to /projects", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsPreview);
    expect(result).toContain('id="projects"');
    const opsellaIndex = result.indexOf("Opsella");
    const dailyIndex = result.indexOf("Daily Activity Log");
    expect(opsellaIndex).toBeGreaterThan(-1);
    expect(dailyIndex).toBeGreaterThan(-1);
    expect(opsellaIndex).toBeLessThan(dailyIndex);
    expect(result).not.toContain("Incident Reporter");
    expect(result).not.toContain("GearHub");
    expect(result).not.toContain("DreamHome");
    expect(result).toContain('href="/projects"');
  });
});

describe("ProjectsFull", () => {
  it("renders all 5 projects with Opsella first", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsFull);
    for (const name of [
      "Opsella",
      "Daily Activity Log",
      "Incident Reporter",
      "GearHub",
      "DreamHome CMS and E-commerce Platform",
    ]) {
      expect(result).toContain(name);
    }
    expect(result.indexOf("Opsella")).toBeLessThan(result.indexOf("Daily Activity Log"));
  });

  it("includes stack and role only where the copy file provides them", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsFull);
    expect(result).toContain("AdonisJS · MySQL · Docker · Tailwind CSS · AWS Lightsail");
    expect(result).toContain("Product design, database architecture, development, deployment");
    expect(result).toContain("My role:</strong> Developer");
  });
});

describe("/projects page", () => {
  it("sets a dedicated title, description, and active nav state", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsPage);
    expect(result).toContain("<title>Projects — Machel Kassah</title>");
    expect(result).toContain('aria-current="page"');
  });
});
```

Save as `tests/projects.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/projects.test.ts`
Expected: FAIL — none of the three files exist.

- [ ] **Step 3: Write src/components/ProjectsPreview.astro**

```astro
---
import { projects } from "../data/projects";
import ImagePlaceholder from "./ImagePlaceholder.astro";

const featured = [...projects]
  .filter((p) => p.featuredOnHome)
  .sort((a, b) => (b.flagship ? 1 : 0) - (a.flagship ? 1 : 0));
---

<section id="projects" class="projects-preview section section--alt">
  <div class="container">
    <h2>Projects</h2>
    <div class="projects-preview__grid">
      {featured.map((project) => (
        <article class={`projects-preview__card ${project.flagship ? "projects-preview__card--flagship" : ""}`}>
          <ImagePlaceholder
            src={project.image.src}
            alt={project.image.alt}
            guidance={project.image.guidance}
            aspect="16/9"
          />
          <p class="label">{project.status}{project.flagship ? " · Flagship" : ""}</p>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </article>
      ))}
    </div>
    <a class="btn btn--secondary" href="/projects">View all projects</a>
  </div>
</section>

<style>
  .projects-preview__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: var(--space-4);
    margin: var(--space-3) 0 var(--space-4);
    align-items: start;
  }

  .projects-preview__card--flagship h3 {
    font-size: 1.5rem;
  }

  @media (max-width: 800px) {
    .projects-preview__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 4: Write src/components/ProjectsFull.astro**

```astro
---
import { projects } from "../data/projects";
import ImagePlaceholder from "./ImagePlaceholder.astro";

const ordered = [...projects].sort((a, b) => (b.flagship ? 1 : 0) - (a.flagship ? 1 : 0));
---

<div class="projects-full">
  {ordered.map((project, index) => (
    <article class={`project-block ${index % 2 === 1 ? "project-block--reverse" : ""}`}>
      <div class="project-block__media">
        <ImagePlaceholder
          src={project.image.src}
          alt={project.image.alt}
          guidance={project.image.guidance}
          aspect="16/9"
        />
      </div>
      <div class="project-block__copy">
        <p class="label">{project.status}{project.flagship ? " · Flagship" : ""}</p>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        {project.problem && <p><strong>Problem:</strong> {project.problem}</p>}
        {project.solution && <p><strong>Solution:</strong> {project.solution}</p>}
        {project.role && <p><strong>My role:</strong> {project.role}</p>}
        {project.stack && <p class="project-block__stack">{project.stack.join(" · ")}</p>}
      </div>
    </article>
  ))}
</div>

<style>
  .project-block {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: var(--space-4);
    align-items: center;
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .project-block--reverse {
    direction: rtl;
  }

  .project-block--reverse > * {
    direction: ltr;
  }

  .project-block__stack {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-ink-muted);
  }

  @media (max-width: 800px) {
    .project-block {
      grid-template-columns: 1fr;
      direction: ltr;
    }
  }
</style>
```

- [ ] **Step 5: Write src/pages/projects.astro**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ProjectsFull from "../components/ProjectsFull.astro";
---

<BaseLayout
  title="Projects — Machel Kassah"
  description="Operational reporting, incident management, PPE inventory, POS/ERP, and e-commerce platforms designed and built by Machel Kassah."
  currentPath="/projects"
>
  <section class="section">
    <div class="container">
      <h1>Projects</h1>
      <ProjectsFull />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- tests/projects.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/ProjectsPreview.astro src/components/ProjectsFull.astro src/pages/projects.astro tests/projects.test.ts
git commit -m "Add Projects preview, full page, and /projects route"
```

---

### Task 9: Ventures (preview, full page, route)

**Files:**
- Create: `src/components/VenturesPreview.astro`
- Create: `src/components/VenturesFull.astro`
- Create: `src/pages/ventures.astro`
- Create: `tests/ventures.test.ts`

**Interfaces:**
- Consumes: `ventures` (Task 3), `BaseLayout` (Task 5).
- Produces: `<VenturesPreview />` (`id="ventures"`, used on Home in Task 12), `<VenturesFull />` (used by this task's `/ventures` page).

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import VenturesPreview from "../src/components/VenturesPreview.astro";
import VenturesFull from "../src/components/VenturesFull.astro";
import VenturesPage from "../src/pages/ventures.astro";

describe("VenturesPreview (Home)", () => {
  it("shows all 3 ventures with a link to /ventures", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(VenturesPreview);
    expect(result).toContain('id="ventures"');
    expect(result).toContain("Enthrive");
    expect(result).toContain("DeleOps");
    expect(result).toContain("Opsella");
    expect(result).toContain('href="/ventures"');
  });
});

describe("VenturesFull", () => {
  it("renders all 3 ventures with their copy-file descriptions", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(VenturesFull);
    expect(result).toContain("Corporate branding, merchandise, and creative/media services based in Ghana.");
    expect(result).toContain(
      "Software engineering and technology products, including internal business systems and Opsella."
    );
    expect(result).toContain("A POS and ERP platform for small and growing businesses.");
  });
});

describe("/ventures page", () => {
  it("sets a dedicated title, description, and active nav state", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(VenturesPage);
    expect(result).toContain("<title>Ventures — Machel Kassah</title>");
    expect(result).toContain('aria-current="page"');
  });
});
```

Save as `tests/ventures.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/ventures.test.ts`
Expected: FAIL — none of the three files exist.

- [ ] **Step 3: Write src/components/VenturesPreview.astro**

```astro
---
import { ventures } from "../data/ventures";
---

<section id="ventures" class="ventures-preview section">
  <div class="container">
    <h2>Ventures</h2>
    <div class="ventures-preview__grid">
      {ventures.map((venture) => (
        <article class="ventures-preview__card">
          <h3>{venture.name}</h3>
          <p>{venture.description}</p>
        </article>
      ))}
    </div>
    <a class="btn btn--secondary" href="/ventures">View all ventures</a>
  </div>
</section>

<style>
  .ventures-preview__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
    margin: var(--space-3) 0 var(--space-4);
  }

  .ventures-preview__card {
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  @media (max-width: 800px) {
    .ventures-preview__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 4: Write src/components/VenturesFull.astro**

```astro
---
import { ventures } from "../data/ventures";
---

<div class="ventures-full">
  {ventures.map((venture, index) => (
    <article class={`venture-block ${index % 2 === 1 ? "venture-block--alt" : ""}`}>
      <p class="label">Venture {String(index + 1).padStart(2, "0")}</p>
      <h2>{venture.name}</h2>
      <p class="venture-block__description">{venture.description}</p>
    </article>
  ))}
</div>

<style>
  .venture-block {
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .venture-block__description {
    max-width: 48ch;
    font-size: 1.1rem;
  }
</style>
```

- [ ] **Step 5: Write src/pages/ventures.astro**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import VenturesFull from "../components/VenturesFull.astro";
---

<BaseLayout
  title="Ventures — Machel Kassah"
  description="Enthrive, DeleOps, and Opsella — the branding, software, and product ventures Machel Kassah runs alongside his operations career."
  currentPath="/ventures"
>
  <section class="section">
    <div class="container">
      <h1>Ventures</h1>
      <VenturesFull />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- tests/ventures.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/VenturesPreview.astro src/components/VenturesFull.astro src/pages/ventures.astro tests/ventures.test.ts
git commit -m "Add Ventures preview, full page, and /ventures route"
```

---

### Task 10: Leadership & Education section

**Files:**
- Create: `src/components/LeadershipEducation.astro`
- Create: `tests/leadership-education.test.ts`

**Interfaces:**
- Consumes: `leadership`, `education`, `certifications` (Task 3).
- Produces: `<LeadershipEducation />` (`id="education"`), used by `src/pages/index.astro` in Task 12.
- Note: the copy file's "Awards: None at this time" is a negative value, not a fact to display — this component renders no Awards line at all (documented in the final README in Task 14).

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import LeadershipEducation from "../src/components/LeadershipEducation.astro";

describe("LeadershipEducation", () => {
  it("has id=education and renders both leadership items and all 3 degrees with no invented years", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LeadershipEducation);
    expect(result).toContain('id="education"');
    expect(result).toContain("Leadership &amp; Community");
    expect(result).toContain("Volunteer, Google Developer Conference, Ghana 2025");
    expect(result).toContain("Member, Linux Accra User Group");
    expect(result).toContain("Education &amp; Certifications");
    expect(result).toContain("MSc Computer Science");
    expect(result).toContain("University of Ghana, Legon");
    expect(result).toContain("BSc Information Technology Education");
    expect(result).toContain("Certificate in Information Technology");
  });

  it("renders all 3 certifications", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LeadershipEducation);
    expect(result).toContain("Microsoft Technology Associate");
    expect(result).toContain("GI-KACE Data Science Certificate");
    expect(result).toContain("GI-KACE Data Analysis with Python Certificate");
  });

  it("does not display an Awards line, since the copy file lists no awards", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LeadershipEducation);
    expect(result).not.toMatch(/award/i);
  });
});
```

Save as `tests/leadership-education.test.ts`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/leadership-education.test.ts`
Expected: FAIL — the component does not exist.

- [ ] **Step 3: Write the component**

```astro
---
import { leadership } from "../data/leadership";
import { education, certifications } from "../data/education";
---

<section id="education" class="leadership-education section section--alt">
  <div class="container leadership-education__grid">
    <div>
      <h2>Leadership &amp; Community</h2>
      <ul class="plain-list">
        {leadership.map((item) => <li>{item}</li>)}
      </ul>
    </div>
    <div>
      <h2>Education &amp; Certifications</h2>
      <ul class="plain-list">
        {education.map((degree) => (
          <li><strong>{degree.credential}</strong> — {degree.institution}</li>
        ))}
      </ul>
      <p class="label leadership-education__certs-label">Certifications</p>
      <ul class="plain-list">
        {certifications.map((cert) => <li>{cert}</li>)}
      </ul>
    </div>
  </div>
</section>

<style>
  .leadership-education__grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: var(--space-4);
  }

  .leadership-education__certs-label {
    margin-top: var(--space-2);
  }

  .plain-list {
    list-style: none;
    margin: var(--space-2) 0 0;
    padding: 0;
  }

  .plain-list li {
    margin-bottom: var(--space-1);
  }

  @media (max-width: 800px) {
    .leadership-education__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/leadership-education.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/LeadershipEducation.astro tests/leadership-education.test.ts
git commit -m "Add Leadership & Community and Education & Certifications section"
```

---

### Task 11: Contact section with fetch-based form submission

**Files:**
- Create: `src/scripts/contact-form.ts`
- Create: `src/components/Contact.astro`
- Create: `tests/contact-form-script.test.ts`
- Create: `tests/contact.test.ts`

**Interfaces:**
- Consumes: `contact` (Task 3).
- Produces: `submitContactForm(formData: FormData, form: ContactFormLike, status: FormStatusElement, fetchImpl: typeof fetch): Promise<void>` from `src/scripts/contact-form.ts`; `<Contact />` (`id="contact"`), used by `src/pages/index.astro` in Task 12.

- [ ] **Step 1: Write the failing script test**

```ts
import { describe, it, expect, vi } from "vitest";
import { submitContactForm } from "../src/scripts/contact-form";

function makeStatus() {
  return { textContent: "", dataset: {} as { state?: string } };
}

function makeForm() {
  return { action: "https://formspree.io/f/YOUR_FORM_ID", reset: vi.fn() };
}

describe("submitContactForm", () => {
  it("shows a success message and resets the form on a 200 response", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });

    await submitContactForm(new FormData(), form, status, fetchImpl as unknown as typeof fetch);

    expect(status.dataset.state).toBe("success");
    expect(status.textContent).toContain("sent");
    expect(form.reset).toHaveBeenCalledOnce();
  });

  it("shows an error message and does not reset the form on a non-ok response", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    await submitContactForm(new FormData(), form, status, fetchImpl as unknown as typeof fetch);

    expect(status.dataset.state).toBe("error");
    expect(form.reset).not.toHaveBeenCalled();
  });

  it("shows an error message when fetch rejects (network failure)", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockRejectedValue(new Error("network down"));

    await submitContactForm(new FormData(), form, status, fetchImpl as unknown as typeof fetch);

    expect(status.dataset.state).toBe("error");
  });

  it("calls fetch with the form's action, POST, and Accept: application/json", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    const formData = new FormData();

    await submitContactForm(formData, form, status, fetchImpl as unknown as typeof fetch);

    expect(fetchImpl).toHaveBeenCalledWith(
      form.action,
      expect.objectContaining({
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
    );
  });
});
```

Save as `tests/contact-form-script.test.ts`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/contact-form-script.test.ts`
Expected: FAIL — `src/scripts/contact-form.ts` does not exist.

- [ ] **Step 3: Write src/scripts/contact-form.ts**

```ts
export interface ContactFormLike {
  action: string;
  reset(): void;
}

export interface FormStatusElement {
  textContent: string;
  dataset: { state?: string };
}

export async function submitContactForm(
  formData: FormData,
  form: ContactFormLike,
  status: FormStatusElement,
  fetchImpl: typeof fetch
): Promise<void> {
  status.textContent = "Sending…";
  status.dataset.state = "pending";

  try {
    const response = await fetchImpl(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      status.textContent = "Thanks — your message has been sent. I'll reply within 1–2 business days.";
      status.dataset.state = "success";
      form.reset();
    } else {
      status.textContent = "Something went wrong sending that. Please try emailing directly instead.";
      status.dataset.state = "error";
    }
  } catch {
    status.textContent = "Something went wrong sending that. Please try emailing directly instead.";
    status.dataset.state = "error";
  }
}
```

- [ ] **Step 4: Run the script test to verify it passes**

Run: `npm test -- tests/contact-form-script.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write the failing Contact component test**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Contact from "../src/components/Contact.astro";

describe("Contact", () => {
  it("has id=contact and labels the personal and business emails separately", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).toContain('id="contact"');
    expect(result).toContain("Personal");
    expect(result).toContain("machelkassah@gmail.com");
    expect(result).toContain("Business inquiries");
    expect(result).toContain("deleoperations@gmail.com");
    expect(result).toContain("linkedin.com/in/machelkassah");
    expect(result).toContain("github.com/machelkassah");
    expect(result).toContain("Accra, Ghana");
  });

  it("has Name/Email/Message fields posting to the Formspree placeholder endpoint", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).toContain('name="name"');
    expect(result).toContain('name="email"');
    expect(result).toContain('name="message"');
    expect(result).toContain('action="https://formspree.io/f/YOUR_FORM_ID"');
  });

  it("has no phone input field", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).not.toContain('name="phone"');
  });

  it("includes the response-time note from the copy file", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).toContain("I typically respond within 1–2 business days");
  });
});
```

Save as `tests/contact.test.ts`.

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- tests/contact.test.ts`
Expected: FAIL — `src/components/Contact.astro` does not exist.

- [ ] **Step 7: Write src/components/Contact.astro**

```astro
---
import { contact } from "../data/contact";
---

<section id="contact" class="contact section">
  <div class="container contact__grid">
    <div class="contact__info">
      <h2>Contact</h2>
      <dl class="contact__list">
        <div>
          <dt class="label">Personal</dt>
          <dd><a href={`mailto:${contact.personalEmail}`}>{contact.personalEmail}</a></dd>
        </div>
        <div>
          <dt class="label">Business inquiries</dt>
          <dd><a href={`mailto:${contact.businessEmail}`}>{contact.businessEmail}</a></dd>
        </div>
        <div>
          <dt class="label">LinkedIn</dt>
          <dd><a href={contact.linkedin}>{contact.linkedin.replace("https://", "")}</a></dd>
        </div>
        <div>
          <dt class="label">GitHub</dt>
          <dd><a href={contact.github}>{contact.github.replace("https://", "")}</a></dd>
        </div>
        <div>
          <dt class="label">Location</dt>
          <dd>{contact.location}</dd>
        </div>
      </dl>
      <p class="contact__note">{contact.responseNote}</p>
    </div>
    <form class="contact__form" action={contact.formEndpoint} method="POST">
      <!--
        Replace `formEndpoint` in src/data/contact.ts with your real
        Formspree endpoint (https://formspree.io/f/YOUR_FORM_ID) once the
        form is created at formspree.io.
      -->
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" required></textarea>

      <button class="btn btn--primary" type="submit">Send message</button>
      <p class="contact__form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>

<script>
  import { submitContactForm } from "../scripts/contact-form";

  const form = document.querySelector<HTMLFormElement>(".contact__form");
  const status = document.querySelector<HTMLParagraphElement>(".contact__form-status");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form || !status) return;
    submitContactForm(new FormData(form), form, status, window.fetch.bind(window));
  });
</script>

<style>
  .contact__grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: var(--space-4);
  }

  .contact__list {
    margin: var(--space-3) 0;
  }

  .contact__list > div {
    margin-bottom: var(--space-2);
  }

  .contact__list dd {
    margin: 0;
  }

  .contact__note {
    color: var(--color-ink-muted);
  }

  .contact__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .contact__form input,
  .contact__form textarea {
    font-family: var(--font-body);
    padding: var(--space-1);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background-color: var(--color-bg);
    color: var(--color-ink);
  }

  .contact__form button {
    margin-top: var(--space-2);
    align-self: flex-start;
    border: none;
    cursor: pointer;
  }

  .contact__form-status {
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }

  @media (max-width: 800px) {
    .contact__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- tests/contact.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 9: Commit**

```bash
git add src/scripts/contact-form.ts src/components/Contact.astro tests/contact-form-script.test.ts tests/contact.test.ts
git commit -m "Add Contact section with fetch-based Formspree submission"
```

---

### Task 12: Home page assembly

**Files:**
- Modify: `src/pages/index.astro` (replaces the Task 1 placeholder)
- Create: `tests/home.test.ts`
- Delete: `tests/scaffold.test.ts` (superseded by `tests/home.test.ts`)

**Interfaces:**
- Consumes: `BaseLayout` (Task 5), `Hero`/`About` (Task 6), `Experience`/`Skills` (Task 7), `ProjectsPreview` (Task 8), `VenturesPreview` (Task 9), `LeadershipEducation` (Task 10), `Contact` (Task 11), `site` (Task 3).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import HomePage from "../src/pages/index.astro";

describe("Home page", () => {
  it("assembles every section in the spec's order with the right ids", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    const ids = ["home", "about", "experience", "skills", "projects", "ventures", "education", "contact"];
    let lastIndex = -1;
    for (const id of ids) {
      const idx = result.indexOf(`id="${id}"`);
      expect(idx, `expected id="${id}" to be present`).toBeGreaterThan(-1);
      expect(idx, `expected id="${id}" to come after the previous section`).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });

  it("sets the composed home title and positioning-statement description", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result).toContain("<title>Machel Kassah — Operations Technologist &amp; Digital Systems Builder</title>");
    expect(result).toContain('content="I design practical digital systems');
  });

  it("has exactly one h1", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    const h1Count = (result.match(/<h1[ >]/g) ?? []).length;
    expect(h1Count).toBe(1);
  });

  it("never mentions a phone number or a CV/résumé download anywhere on the page", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result.toLowerCase()).not.toMatch(/resume|curriculum vitae|\.pdf|tel:|\+233/);
  });
});
```

Save as `tests/home.test.ts`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/home.test.ts`
Expected: FAIL — `src/pages/index.astro` still renders the Task 1 placeholder, not the assembled sections.

- [ ] **Step 3: Replace src/pages/index.astro**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import Experience from "../components/Experience.astro";
import Skills from "../components/Skills.astro";
import ProjectsPreview from "../components/ProjectsPreview.astro";
import VenturesPreview from "../components/VenturesPreview.astro";
import LeadershipEducation from "../components/LeadershipEducation.astro";
import Contact from "../components/Contact.astro";
import { site } from "../data/site";
---

<BaseLayout
  title={`${site.name} — ${site.headline}`}
  description={site.positioningStatement}
  currentPath="/"
>
  <Hero />
  <About />
  <Experience />
  <Skills />
  <ProjectsPreview />
  <VenturesPreview />
  <LeadershipEducation />
  <Contact />
</BaseLayout>
```

- [ ] **Step 4: Delete the now-superseded scaffold test**

Run: `rm tests/scaffold.test.ts`

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — full suite green, no reference to the deleted scaffold test remains.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro tests/home.test.ts
git rm tests/scaffold.test.ts
git commit -m "Assemble the Home page from all sections"
```

---

### Task 13: Mobile nav menu and responsive coverage check

**Files:**
- Modify: `src/components/Header.astro`
- Create: `tests/responsive.test.ts`
- Modify: `tests/layout.test.ts` (add one assertion)

**Interfaces:**
- Modifies Header's existing markup/props (no signature change) to add a CSS-only (checkbox-driven) mobile menu toggle.

- [ ] **Step 1: Write the failing test**

Add to `tests/layout.test.ts`, inside the existing `describe("Header", ...)` block:

```ts
  it("includes a checkbox-driven mobile menu toggle that needs no client JS", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header, { props: {} });
    expect(result).toContain('id="nav-toggle"');
    expect(result).toContain('for="nav-toggle"');
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/layout.test.ts`
Expected: FAIL — Header has no `#nav-toggle` yet.

- [ ] **Step 3: Update src/components/Header.astro**

Replace the entire file with:

```astro
---
export interface Props {
  currentPath?: string;
}
const { currentPath = "/" } = Astro.props;

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
  { label: "Ventures", href: "/ventures" },
  { label: "Contact", href: "/#contact" },
];
---

<header class="site-header">
  <div class="site-header__inner container">
    <a href="/" class="site-header__name">Machel Kassah</a>
    <input type="checkbox" id="nav-toggle" class="site-header__toggle-input" aria-hidden="true" />
    <label for="nav-toggle" class="site-header__toggle" aria-label="Toggle navigation">
      <span></span>
      <span></span>
      <span></span>
    </label>
    <nav aria-label="Primary" class="site-header__nav-wrap">
      <ul class="site-header__nav">
        {navItems.map((item) => (
          <li>
            <a
              href={item.href}
              class="site-header__link"
              aria-current={
                (item.href === "/projects" && currentPath === "/projects") ||
                (item.href === "/ventures" && currentPath === "/ventures")
                  ? "page"
                  : undefined
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .site-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2);
    position: relative;
  }

  .site-header__name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--color-ink);
    text-decoration: none;
  }

  .site-header__toggle-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .site-header__toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    width: 24px;
    cursor: pointer;
  }

  .site-header__toggle span {
    display: block;
    height: 2px;
    background-color: var(--color-ink);
  }

  .site-header__nav {
    display: flex;
    gap: var(--space-3);
    list-style: none;
    margin: 0;
    padding: 0;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .site-header__link {
    color: var(--color-ink);
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
  }

  .site-header__link:hover,
  .site-header__link[aria-current="page"] {
    border-bottom-color: var(--color-accent);
    color: var(--color-accent);
  }

  @media (max-width: 640px) {
    .site-header__toggle {
      display: flex;
    }

    .site-header__nav-wrap {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      padding: var(--space-2);
    }

    .site-header__toggle-input:checked ~ .site-header__nav-wrap {
      display: block;
    }

    .site-header__nav {
      flex-direction: column;
      gap: var(--space-2);
    }
  }
</style>
```

- [ ] **Step 4: Run the layout test to verify it passes**

Run: `npm test -- tests/layout.test.ts`
Expected: PASS (all tests, including the new one).

- [ ] **Step 5: Write the responsive-coverage regression test**

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const componentsDir = join(process.cwd(), "src/components");
const gridComponents = [
  "Hero.astro",
  "About.astro",
  "ProjectsPreview.astro",
  "ProjectsFull.astro",
  "VenturesPreview.astro",
  "LeadershipEducation.astro",
  "Contact.astro",
];

describe("responsive coverage", () => {
  it("every multi-column component defines a mobile breakpoint", () => {
    for (const file of gridComponents) {
      const content = readFileSync(join(componentsDir, file), "utf-8");
      expect(content, `${file} should define a @media breakpoint`).toMatch(/@media \(max-width: \d+px\)/);
    }
  });

  it("Header defines the mobile nav collapse breakpoint", () => {
    const content = readFileSync(join(componentsDir, "Header.astro"), "utf-8");
    expect(content).toMatch(/@media \(max-width: 640px\)/);
  });
});
```

Save as `tests/responsive.test.ts`.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- tests/responsive.test.ts`
Expected: PASS (2 tests) — every component listed already has its breakpoint from earlier tasks, and Header now has one too.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.astro tests/layout.test.ts tests/responsive.test.ts
git commit -m "Add CSS-only mobile nav menu and a responsive-coverage regression test"
```

---

### Task 14: Final build QA and documentation

**Files:**
- Create: `README.md`

**Interfaces:**
- No new code interfaces — this task verifies the assembled site and documents it.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — every test file from Tasks 1–13 passes together (scaffold test already removed in Task 12).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: exits 0. `dist/index.html`, `dist/projects/index.html`, and `dist/ventures/index.html` all exist.

- [ ] **Step 3: Grep the built output for content-policy violations**

Run:
```bash
grep -riE "resume|curriculum vitae|tel:|\+233" dist/index.html dist/projects/index.html dist/ventures/index.html
```
Expected: no matches (grep exits 1).

- [ ] **Step 4: Grep the built output for required identity content on every page**

Run:
```bash
grep -l "Machel Kassah" dist/index.html dist/projects/index.html dist/ventures/index.html
```
Expected: all three files listed.

- [ ] **Step 5: Write README.md**

```markdown
# Machel Kassah — Personal Website

Operations Technologist & Digital Systems Builder — Accra, Ghana.

Built with [Astro](https://astro.build) as a static site (no backend). Hybrid
structure: `/` is a single scrolling home page; `/projects` and `/ventures`
are dedicated pages with more room per item.

## Development

\`\`\`bash
npm install
npm run dev      # http://localhost:4321
npm test         # run the Vitest suite
npm run build    # static output to dist/
npm run preview  # preview the production build locally
\`\`\`

## Content

All copy comes from `content/copy-source.md`. To change any text, edit the
matching file in `src/data/` — components read from there, never hardcode
content.

## Swapping in real photos and screenshots

Every image on the site is currently a placeholder box showing where a real
photo or screenshot goes. To swap one in: drop the file at the exact path
below into `public/` — it renders automatically, no code change needed.

| Slot | Path |
|---|---|
| Hero portrait | `public/images/hero-portrait.jpg` |
| About secondary photo | `public/images/about-secondary.jpg` |
| Daily Activity Log | `public/images/projects/daily-activity-log.jpg` |
| Incident Reporter | `public/images/projects/incident-reporter.jpg` |
| GearHub | `public/images/projects/gearhub.jpg` |
| Opsella | `public/images/projects/opsella.jpg` |
| DreamHome CMS | `public/images/projects/dreamhome-cms.jpg` |

Hero portrait and About photo are 4:5. All project screenshots are 16:9,
1600×900px minimum. Scrub any real names/data per the guidance text shown in
each placeholder before uploading.

## Contact form

The form posts to a placeholder Formspree endpoint. To go live:
1. Create a form at [formspree.io](https://formspree.io).
2. Replace `formEndpoint` in `src/data/contact.ts` with your real endpoint
   (`https://formspree.io/f/YOUR_FORM_ID`).

## Deploying

`npm run build` produces a static `dist/` folder — deploy it as-is to Vercel,
Netlify, or GitHub Pages.

## Content decisions on record

- **Opsella** intentionally appears both on `/projects` (flagship) and
  `/ventures`, per your confirmation.
- **Awards** — the copy file lists "None at this time," so no Awards line is
  rendered (nothing to show, rather than a visible negative).
- No phone number and no CV/résumé download anywhere, per the original brief.
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "Add project README with setup, image-swap, and deploy instructions"
```

---

## Self-Review Notes

- **Spec coverage:** Hero/About/Experience/Skills/Projects/Ventures/Leadership/Education/Contact/Footer all have a task; hybrid IA (Task 8 & 9 routes plus Task 12 Home assembly); design tokens (Task 2); images-as-placeholders with one-step (in this case zero-step) swap (Task 4); Formspree wiring (Task 11); accessibility (alt/aria-label throughout, single-h1 check in Task 12, keyboard-navigable checkbox nav in Task 13); responsive down to 375px (per-component breakpoints, guarded by Task 13's regression test); SEO/meta (Task 5 + per-page titles in Tasks 8/9/12); motion (reveal keyframes in Task 2, applied in Task 6, `prefers-reduced-motion` respected); content-policy guardrails (no phone/CV, checked in Tasks 3, 5, 12, and 14).
- **Placeholder scan:** no TBD/TODO markers; the one `YOUR_FORM_ID` and the `site:` config comment are intentional, clearly-labeled placeholders for post-launch values Machel supplies, not unfinished plan content.
- **Type consistency:** `Project`, `Venture`, `ExperienceEntry`, `SkillCategory`, `Degree`, `ImageSlot`, `CtaLink`, `ContactFormLike`, `FormStatusElement` are each defined once (Task 3 or 11) and consumed with the same shape everywhere they're imported.
- **Ampersand handling:** verified empirically against the installed Astro version that `{}` interpolation escapes `&` to `&amp;` and `set:html` does not escape; all rendered-HTML test assertions use the form that matches how each string reaches the page.
