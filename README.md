# peakseasonmedia.com

Static marketing site for **Peak Season Media**, a food & beverage marketing
agency in Sarasota, Florida. No build step, no dependencies — plain HTML, one
stylesheet, one script.

## Deploying

Netlify project `peak-season-media`. `netlify.toml` sets `publish = "."`.

```bash
netlify deploy --dir . --site peak-season-media          # draft
netlify deploy --dir . --site peak-season-media --prod   # production
```

Or drag this folder onto the Deploys tab in the Netlify dashboard.

## Structure

- `*.html` — 41 pages: homepage, about, contact, 6 who-we-serve pages,
  4 service pages, blog index, 25 blog posts, accessibility statement, 404
- `styles.css` / `script.js` — the source files you edit
- `styles.<hash>.css` / `script.<hash>.js` — fingerprinted copies the pages
  actually reference
- `images/` — photography
- `favicon.*`, `apple-touch-icon.png`, `site.webmanifest` — icon set
- `_headers`, `_redirects`, `netlify.toml` — Netlify config
- `sitemap.xml`, `robots.txt`

## Important: re-fingerprint after editing CSS or JS

Pages reference the hashed filenames, which are cached `immutable` for a year.
If you edit `styles.css` or `script.js` you MUST regenerate the hashed copy and
repoint the pages, or your change will not reach anyone who has visited before:

```bash
python3 - <<'PY'
import hashlib, re, glob, os
h = lambda p: hashlib.sha256(open(p,'rb').read()).hexdigest()[:10]
css, js = f'styles.{h("styles.css")}.css', f'script.{h("script.js")}.js'
open(css,'wb').write(open('styles.css','rb').read())
open(js,'wb').write(open('script.js','rb').read())
for old in glob.glob('styles.*.css') + glob.glob('script.*.js'):
    if old not in (css, js): os.remove(old)
for f in glob.glob('*.html'):
    s = open(f, encoding='utf-8').read()
    s = re.sub(r'href="/styles(\.[0-9a-f]{10})?\.css"', f'href="/{css}"', s)
    s = re.sub(r'src="/script(\.[0-9a-f]{10})?\.js"', f'src="/{js}"', s)
    open(f, 'w', encoding='utf-8').write(s)
print("repointed to", css, js)
PY
```

## Accessibility

Targets WCAG 2.1 Level AA. Every page passes axe-core's WCAG 2.0/2.1 A+AA
rulesets with zero violations at 1440px and 390px. See `/accessibility.html`.

Two orange tokens exist deliberately: `--orange` (#F58220) is the brand colour
for non-text elements only; `--orange-ink` (#AD5300) is used wherever orange
carries text, because the brand orange measures 2.5:1 on the page background and
cannot pass AA. Primary buttons keep the brand orange fill with navy text (6.2:1).
Do not "simplify" these back into one token.
