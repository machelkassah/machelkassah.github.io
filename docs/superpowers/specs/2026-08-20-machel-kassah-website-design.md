# Machel Kassah Personal Website — Design Spec

Date: 2026-08-20
Source of truth for all content: `machel-kassah-website-copy.md` (copied into the repo as `content/copy-source.md` for reference — see Content section).

## Purpose

A professional site for Machel Kassah — Operations Technologist & Digital Systems Builder, Accra, Ghana — targeting employers, technology leaders, and business partners evaluating him for operations/technology leadership, software collaboration, or consulting. Must read as credible and senior, differentiated by the combination of operations/compliance experience, hands-on software development, and entrepreneurship. Not a generic developer portfolio.

## Content policy

All copy, dates, project details, and figures come verbatim from `machel-kassah-website-copy.md`. No invented facts. Where the source has a bracketed placeholder or an unresolved note, the corresponding UI element is either left empty/hidden or rendered as an explicit placeholder (images) — never filled with invented content.

Resolved ambiguities (confirmed by Machel):
- **Opsella**: appears in both Projects (full flagship card) and Ventures (its own venture card), as-is in the copy file.
- **Secondary About photo**: included as a second placeholder slot in the About section.
- **Build approach**: Astro.
- **Site structure**: Hybrid — Home stays a single-page scroll; Projects and Ventures each get their own dedicated page with more room per item. See Information Architecture below.

## Tech stack

- **Astro** (static output, no client-side framework runtime). `astro build` → `dist/`, deployable to Vercel/Netlify/GitHub Pages unmodified.
- Plain CSS (custom properties for the design tokens below), no CSS framework.
- No client JS beyond: smooth-scroll anchor nav (CSS `scroll-behavior` + minor JS fallback for older browsers if needed) and the contact form's fetch-based submit-and-confirm handling.

## Information architecture

Hybrid structure: Home is a single scrolling page for the "get the picture in one visit" content; Projects and Ventures — the two sections that benefit most from room to breathe — get their own dedicated pages.

**Home (`/`)** — sticky header, anchor nav, sections in order:
1. Hero
2. About
3. Experience (timeline)
4. Skills (grouped by category — full list; compact enough that a separate page isn't warranted)
5. Projects preview — Opsella (flagship) plus one more featured project as larger teaser cards, "View all projects →" linking to `/projects`
6. Ventures preview — all three venture cards at compact size (there are only three, so nothing is hidden here), "View all ventures →" linking to `/ventures`
7. Leadership & Community (compact, folded in near Education, not a heavy standalone section)
8. Education & Certifications
9. Contact
10. Footer

**Projects (`/projects`)** — full treatment of all five projects as alternating image-left/image-right feature blocks (status, problem/solution where the copy has it, role, stack, image placeholder). Opsella rendered first/largest as the flagship, per the copy file's own note.

**Ventures (`/ventures`)** — the same three ventures (Enthrive, DeleOps, Opsella) with more layout room than the home teaser. The copy file's venture descriptions are intentionally one-liners, so "more room" means larger typographic/visual treatment, not invented detail — no new facts are added beyond what's in the copy file.

**Navigation.** Header nav items: Home, About, Experience, Skills, Projects, Ventures, Contact. About/Experience/Skills/Contact are anchor links to the Home page's sections (`/#about`, etc. — resolving correctly whether the visitor is already on Home or navigating from a sub-page). Projects and Ventures are direct page links (`/projects`, `/ventures`). The current page/section is indicated in the nav (active state). Footer appears on all three pages and repeats the essential contact/social links.

No phone number, no CV/résumé download anywhere — intentionally excluded per the copy file.

## Component structure

```
src/
  pages/
    index.astro              — Home: assembles all single-page sections
    projects.astro            — full Projects page (all 5, alternating feature blocks)
    ventures.astro             — full Ventures page (3 ventures, expanded layout)
  layouts/
    BaseLayout.astro          — <head>/SEO/meta, Header, Footer, shared across all pages
  components/
    Header.astro              — sticky nav; anchor links for Home sections, page links for Projects/Ventures; active-state aware
    Hero.astro
    About.astro
    Experience.astro          — vertical timeline layout
    Skills.astro              — grouped by category
    ProjectsPreview.astro     — Home teaser: Opsella + 1 featured project, "View all" link
    ProjectsFull.astro        — full alternating feature-block list, used by pages/projects.astro
    VenturesPreview.astro     — Home teaser: all 3 compact cards, "View all" link
    VenturesFull.astro        — expanded 3-venture layout, used by pages/ventures.astro
    LeadershipEducation.astro — compact combined block (Leadership list + Education/Certs)
    Contact.astro             — two labeled emails, LinkedIn, GitHub, location, form
    Footer.astro
    ImagePlaceholder.astro    — reusable placeholder box (aspect-ratio, guidance text, swap comment)
  data/
    experience.ts
    skills.ts
    projects.ts
    ventures.ts
    leadership.ts
    education.ts
    contact.ts
  styles/
    global.css                — design tokens, base styles, section rhythm
public/
  images/                      — swap targets referenced by ImagePlaceholder `data-src`
  favicon.svg
```

Each `src/data/*.ts` file is a typed array/object transcribed directly from the copy file — this is the single content source every page/component reads from (Home's preview components and the dedicated full-page components both read the same `projects.ts` / `ventures.ts`, just render different subsets/layouts), keeping content edits separate from markup.

## Design tokens

**Typography**
- Headings: **Fraunces** (variable, warm display serif) — used large on hero headline and section titles, sparingly elsewhere.
- Body/UI: **Archivo** — body copy, nav, buttons, card text.
- Metadata/labels (dates, stack tags, status pills, nav micro-labels): **IBM Plex Mono**, small, uppercase, letter-spaced.
- All three loaded via Google Fonts `<link>` in the base layout.

**Color** (light theme only)
- `--color-bg`: `#F6F1E7` (warm cream, not stark white)
- `--color-bg-alt`: `#EFE7D8` (section-divider tint)
- `--color-ink`: `#211D19` (primary text)
- `--color-ink-muted`: `#5A5248`
- `--color-accent`: `#C1531E` (burnt terracotta — CTAs, links, status-live pill, hover states)
- `--color-accent-tint`: `#F0DCCB` (accent used as background wash, e.g. behind status pills)
- Borders/dividers: low-opacity ink, not pure black.

**Motion**
- One staggered reveal on initial load: hero headline → subhead → CTAs → nav, via CSS `animation-delay` steps, `prefers-reduced-motion` respected (motion disabled/reduced for users who request it).
- Hover states: subtle lift/underline on nav links and project cards, CSS-only.
- No JS animation libraries.

**Layout rhythm**
- Hero: asymmetric split, headline+CTAs left, portrait placeholder right, faint oversized background mark/numeral.
- Experience: vertical timeline (connecting rule + node per role), reverse chronological.
- Home Projects preview: two larger teaser cards (Opsella first/largest as flagship, plus one more), asymmetric, with a clear "View all projects" CTA.
- `/projects` page: alternating image-left/image-right feature blocks for all 5 projects; Opsella still rendered first/largest, per the copy file's own "Flagship product-thinking project" note.
- Home Ventures preview: 3-up compact card row (all three ventures, nothing hidden), with a "View all ventures" CTA.
- `/ventures` page: same three ventures, expanded to larger stacked or asymmetric blocks with more type/whitespace — same copy, more room.
- Section backgrounds alternate `--color-bg` / `--color-bg-alt` with soft-edged dividers (not hard flat lines) to avoid the stacked-flat-sections look; applies within each page.

## Images

Every image slot renders via the shared `ImagePlaceholder` component:
- Correct aspect ratio for its slot (4:5 hero portrait and secondary About photo; 16:9 for all project screenshots).
- Dashed border, muted fill, the copy file's own guidance text rendered inside in small Plex Mono type.
- `alt` text drawn from the copy file's guidance line (never invented).
- A single clearly named swap point per slot, e.g. `/images/hero-portrait.jpg`, `/images/projects/daily-activity-log.jpg` — changing the placeholder to a real image is a one-line `src` change in the relevant `data/*.ts` entry or component prop.

## Contact section

- Two emails, explicitly labeled: personal (`machelkassah@gmail.com`) and business inquiries (`deleoperations@gmail.com`).
- LinkedIn, GitHub, location (Accra, Ghana).
- Response-time note from the copy file.
- Contact form fields: Name / Email / Message.
- Wired to **Formspree** with a placeholder endpoint (`https://formspree.io/f/YOUR_FORM_ID`) and an inline comment marking exactly where to drop in the real form ID.

## SEO / meta

- `BaseLayout.astro` accepts a `title`/`description` prop per page, defaulting to the Home values.
- Home `<title>`: "Machel Kassah — Operations Technologist & Digital Systems Builder"; meta description and Open Graph tags built from the hero positioning statement, verbatim.
- `/projects` and `/ventures` get their own `<title>` ("Projects — Machel Kassah", "Ventures — Machel Kassah") with a short, non-invented description derived from the section's own copy-file framing.
- Favicon (simple mark, since no logo file exists — a minimal initial-based SVG placeholder, clearly swappable).

## Accessibility & responsiveness

- Semantic HTML, one `<h1>` (hero name/headline), logical heading hierarchy through sections.
- Alt text on every image including placeholders.
- Keyboard-navigable nav and form; visible focus states.
- Sufficient contrast between ink/cream/accent (verify accent-on-cream meets WCAG AA for text use; use accent only on large/bold text or backed by a solid chip where needed).
- Mobile-first responsive, tested down to 375px: nav collapses to a compact mobile menu, timeline and feature blocks stack single-column, type scale steps down.

## Out of scope / explicitly excluded

- No phone number anywhere.
- No CV/résumé download.
- No backend — static only, contact form via third-party static form service.
- No invented ventures, awards, dates, or credential IDs beyond what's in the copy file.
- No decision needed on WhatsApp Business number — copy file marks it as a future, non-blocking addition; not included in this build.

## Open items carried forward (not blockers for build)

- Real photos/screenshots — all render as placeholders until Machel supplies files matching the named swap paths.
- Formspree form ID — placeholder until Machel creates the actual form.
