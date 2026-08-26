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
- A&O is a **service-area business**, not a storefront. The Notasulga address
  is a staging yard and customers do not go there. Don't add a "visit us"
  section, a map embed, or directions/hours copy that invites people to the
  address.
- James Gates is the owner and leads the About page. Cole Harper is who
  customers actually deal with, so he is named on `about.html` and
  `contact.html` — described by what he does (estimates, pricing, leading the
  crew) with **no job title**, deliberately. Don't assign him one, don't add
  him to the JSON-LD, and don't promote him above James without asking.

## Google reviews

The rating, review count, and review quotes are hardcoded in the HTML on
purpose — crawlers need them in the markup, not injected by JavaScript. They
come from the A&O Google Business Profile and must be refreshed by hand.

Source of truth: Windsor.ai `google_my_business` connector, location
`locations/10741154088808454428` ("A&O Tree Service LLC").

- `review_average_rating_total` and `review_total_count` give the current
  rating and count.
- `review_reviewer`, `review_star_rating`, `review_comment`,
  `review_create_time` give the reviews themselves.

Last refreshed 2026-08-25: **4.9 stars, 59 reviews**. The figures appear on
`index.html` (ticker header and score box), `testimonials.html` (hero rating
box), and `faq.html` — plus the meta description and JSON-LD `description`
on several pages. Grep for the old numbers to catch them all.

Google CTAs use the Business Profile's own canonical URLs, keyed to place ID
`ChIJ24XO415cjIgRAMcLXYHheo4` — not the old `g.page` short links:

- Read reviews: `https://search.google.com/local/reviews?placeid=...`
- Write a review: `https://search.google.com/local/writereview?placeid=...`
  (this exact URL is what the profile returns as `location_metadata_new_review_uri`)

Review quotes are verbatim, trimmed only with ellipses, dated with an
absolute month and year rather than "2 months ago" so they age gracefully.
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
