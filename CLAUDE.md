# A&O Tree Service — aotrees.com

Static marketing site for a tree service company in Notasulga, Alabama.
No build step: plain HTML at the repo root, deployed on Netlify.

## Working preferences

- **Handle pull requests and merges directly.** Josh has given standing
  authorization to open a PR and merge it to take changes live, without
  asking each time.

## Layout

- One `.html` file per page at the repo root. `thank-you/index.html` is the
  Netlify form redirect target (`action="/thank-you/"`); `thank-you.html` is
  the standalone twin. Both are `noindex`.
- `assets/site.css` is the real stylesheet and loads last, so it wins over
  each page's legacy inline `<style>` block. Prefer editing `site.css`.
- `assets/site.js` builds the mobile nav toggle, sets `loading="lazy"` past
  the first two images, and injects the sticky mobile call bar.
- Photos live in `assets/`. Several are duplicated at the repo root because
  older pages reference them there; check both when changing an image.

## Conventions

- Pages carry a canonical URL, Open Graph tags, and a JSON-LD `@graph`
  (WebPage + WebSite + HomeAndConstructionBusiness, plus Service and
  BreadcrumbList on service pages). Add these to any new page and list it in
  `sitemap.xml`.
- `faq.html` holds visible Q&A **and** a matching FAQPage schema block. Edit
  both together or Google drops the rich result.
- Do not add `aggregateRating` to the business schema. Marking up your own
  Google rating on your own site is self-serving review markup and violates
  Google's structured-data policy.
- Don't publish the license number or state permit rules — Josh's call.
- Images are compressed before commit (photos ≤1500px, progressive JPEG
  q76). Don't commit multi-megabyte originals.
- The homepage "Storm Season Readiness" section is dated on purpose. Refresh
  the copy and badge when the season turns.

## Checking work

There is no test suite. Serve the site and look at it:

```
python3 -m http.server 8899
```

Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` for
headless screenshots and for checking console errors, broken images, dead
internal links, and horizontal overflow at 390/768/1024/1440px.
