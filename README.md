# Machel Kassah — Personal Website

Operations Technologist & Digital Systems Builder — Accra, Ghana.

Built with [Astro](https://astro.build) as a static site (no backend). Hybrid
structure: `/` is a single scrolling home page; `/projects` and `/ventures`
are dedicated pages with more room per item.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # run the Vitest suite
npm run build    # static output to dist/
npm run preview  # preview the production build locally
```

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
