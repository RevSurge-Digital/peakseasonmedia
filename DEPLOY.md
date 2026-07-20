# Peak Season Media — new theme build

Complete static site, ready to publish. Rebuilt from the "Daylight Menu Board"
design handoff, with every existing page rebranded and all URLs preserved.

## Deploying

The Netlify project is **`peak-season-media`** (site ID `9abd2bdf-90e8-4195-9b48-d6c05a2bc26f`,
serving `peakseasonmedia.com`).

Drag this folder onto the Netlify **Deploys** tab, or from the CLI:

```bash
netlify deploy --dir . --site peak-season-media          # draft URL to review
netlify deploy --dir . --site peak-season-media --prod   # go live
```

`netlify.toml` sets `publish = "."` — there is no build step. Nothing here needs
Node, npm, or a bundler.

## What's in the box

**20 pages.** All 17 URLs from the old sitemap, kept at identical slugs, plus
three new ones:

| New page | URL |
|---|---|
| Website Design | `/website-design.html` |
| AI Implementation | `/ai-implementation.html` |
| 404 | `/404.html` |

**Assets**

- `styles.css` — the whole design system, ~600 lines, no dependencies
- `script.js` — nav, dropdowns, accordions. Vanilla, `defer`-loaded
- `favicon.svg`, `favicon.ico`, `favicon-{16,32,48,96,192,512}.png`,
  `apple-touch-icon.png`, `site.webmanifest` — all generated from the new logo
- `images/downtown-sarasota.jpg`, `images/og-image.jpg` — carried over from the
  live site
- `images/logo-full.png` — the full wordmark, included but not yet placed (see
  "Notes" below)
- `_headers`, `_redirects`, `netlify.toml`, `robots.txt`, `sitemap.xml`

## Accessibility

Audited with axe-core against WCAG 2.1 A + AA, every page, at 1440px and 390px:
**0 violations**. Beyond the automated pass:

- Skip-to-content link, one `<h1>` per page, logical heading order
- Nav dropdowns are real `<button aria-expanded>` — keyboard and touch operable,
  not hover-only. Escape closes and returns focus
- Accordions are native `<details>`, so they work with no JS at all
- 3px navy focus ring on every interactive element, 48px minimum tap targets
- `prefers-reduced-motion` honoured; `forced-colors` (Windows High Contrast) handled
- Inline links inside body text carry a permanent underline (WCAG 1.4.1 — colour
  alone is not enough)

### Two deliberate colour changes

The handoff's palette had two combinations that cannot pass AA, so the theme
splits the orange into two tokens:

| Token | Value | Used for |
|---|---|---|
| `--orange` | `#F58220` | Unchanged brand orange — bars, rules, chart, swatches, borders, button fills |
| `--orange-ink` | `#AD5300` | Orange **text** on light backgrounds (5.0:1 vs. `#F58220`'s 2.5:1) |

Primary buttons keep the exact brand orange as their fill but take **navy text**
instead of white — white-on-orange measured 2.6:1. Navy-on-orange is 6.2:1 and
keeps the brand colour untouched, which darkening the orange would not have.

On navy panels `#F58220` clears 6.2:1, so orange text there is unchanged.

## SEO

Verified byte-identical against the old site: every `<title>`, every
`<meta name="description">`, every canonical, every slug. All original JSON-LD
carried across with URLs updated; `AboutPage` and `ContactPage` schema added
where the old pages had none. Sitemap regenerated with the three new URLs.
`robots.txt` explicitly welcomes GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot
and Google-Extended, since AEO is half the pitch.

Internal link check: **0 broken links, 0 dangling anchors.**

## Notes / open items

1. **Only two images existed on the live site** — `downtown-sarasota.jpg` and
   `og-image.jpg`. Both are carried over. The new homepage design specifies no
   photography, so `downtown-sarasota.jpg` is currently unused on-page; it stays
   in `/images/` so no existing link breaks and it remains available if you want
   a photo back on an interior page.
2. **The full wordmark is not placed anywhere yet.** Per the handoff, both final
   pages use the favicon-plus-text lockup, which is what's built. `logo-full.png`
   is included for social profiles, email signatures, etc. Note the handoff's
   caveat: that PNG has heavy internal padding.
3. **Blog index shows the 5 posts that exist.** The design mocked six categories
   and 25 posts from the content plan; those posts aren't written yet. The
   accordion is built to the design and the categories will fill in as posts ship
   — no template work needed, just add rows.
4. **Not backed up to GitHub.** No GitHub connector was available in this session.
   To do it yourself:
   ```bash
   git init && git add . && git commit -m "New theme"
   git remote add origin git@github.com:<you>/peakseasonmedia.git
   git push -u origin main
   ```
