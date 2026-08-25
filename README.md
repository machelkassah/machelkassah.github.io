# Machel Kassah — Personal Website

Operations and Compliance Professional building software solutions for real operational problems — Accra, Ghana.

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

Remaining image slots render as a placeholder box showing where a real photo
or screenshot goes. To fill one in: drop the file at the exact path below
into `public/` — it renders automatically, no code change needed.

| Slot | Path | Status |
|---|---|---|
| Hero portrait | `public/images/hero-portrait.png` | Filled in |
| About secondary photo | `public/images/about-secondary.jpg` | Placeholder |
| Daily Activity Log | `public/images/projects/daily-activity-log.jpg` | Placeholder |
| Incident Reporter | `public/images/projects/incident-reporter.jpg` | Placeholder |
| GearHub | `public/images/projects/gearhub.jpg` | Placeholder |
| Opsella | `public/images/projects/opsella.jpg` | Placeholder |
| DreamHome CMS | `public/images/projects/dreamhome-cms.jpg` | Placeholder |

Hero portrait and About photo are 4:5. All project screenshots are 16:9,
1600×900px minimum. Scrub any real names/data per the guidance text shown in
each placeholder before uploading.

## Contact form

Wired to Web3Forms with a real access key (`src/data/contact.ts`).
Submissions email whatever address was used to get that key. To rotate
the key, get a new one at [web3forms.com](https://web3forms.com) and
replace `web3formsAccessKey`.

## Deploying

`npm run build` produces a static `dist/` folder — deploy it as-is to Vercel,
Netlify, or GitHub Pages.

## Content decisions on record

- **Opsella** intentionally appears both on `/projects` (flagship) and
  `/ventures`, per your confirmation.
- **Awards** — the copy file lists "None at this time," so no Awards line is
  rendered (nothing to show, rather than a visible negative).
- No phone number and no CV/résumé download anywhere, per the original brief.
