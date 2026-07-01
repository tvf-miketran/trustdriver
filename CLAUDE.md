# TrustDriver website — project guide

## What this project is
The **TrustDriver** marketing website — a Customer Experience Intelligence product for
automotive dealerships. Built as **plain HTML5 + CSS**, translated from the Figma design.

- **Stack:** plain HTML5 + CSS. Vanilla JS only where interaction requires it.
- **No framework. No CMS.** One tiny build step for shared chrome (below).
- **Shared header/footer:** the single source is `site/partials/header.html` + `site/partials/footer.html`.
  Pages mark insertion points with `<!-- @include:header -->…<!-- @endinclude:header -->`
  (same for footer). Run `cd site && node _build/gen.mjs` to stamp the partials INLINE into
  every page. Inline = the nav/footer links stay in the crawled HTML (SEO-safe; no runtime JS).
  Edit a partial → re-run gen. Do NOT hand-edit the region between the markers.
  (Partials use root-relative paths; when `pages/` subpages are added, extend gen.mjs to rewrite
  `images/`→`../images/` for that folder.)
- **Source of truth:** the Figma design. Pull exact values (colors, spacing, type) — don't eyeball.
- Output lives in `site/` (`site/index.html`, `site/css/styles.css`, `site/images/`).
  Serve with `cd site && python -m http.server 8000`.
- **Live domain:** https://trustdriver.com (new site) — use for all canonical URLs, sitemap, and OG/Twitter tags.

## SEO requirements (NON-NEGOTIABLE — enforce on every page)
- **Build for current AND future state** — structure URLs and page hierarchy so new
  pages (solutions, articles, etc.) can be added later without restructuring. No CMS, but
  the file/URL layout must scale as if more pages are coming.
- **Compliant, semantic structure:** exactly **one `<h1>` per page**; never skip heading
  levels (h1 → h2 → h3 …); use `<header> <nav> <main> <section> <article> <footer>` correctly.
- **Google crawl optimization:** clean, descriptive URLs; internal linking between related
  pages; `<link rel="canonical">` on every page; sensible `robots` directives; keep a sitemap.
- **Images:** every `<img>` needs descriptive `alt`, explicit `width`/`height` (prevent CLS),
  and `loading="lazy"` for below-the-fold images. Decorative images use empty `alt=""`.
- **Meta tags:** every page needs a unique `<title>`, `<meta name="description">`, Open Graph,
  Twitter Card, and JSON-LD structured data appropriate to the page type
  (Organization/WebSite on home, Article on article pages, BreadcrumbList where relevant).
- **When meta content is unclear, ASK — don't invent** titles/descriptions. Confirm with the user.

## Design fidelity
- Match the Figma design's spacing, colors, and typography. Pull exact values rather than guessing.
- When updating shared chrome (nav/header/footer), keep it in sync across pages.
- Bump the `?v=N` query on the `styles.css` link when CSS changes, so cached pages refresh.

## Working agreement
- Confirm before destructive actions (deleting folders, overwriting files you didn't create).
- Keep `site/sitemap.xml` and `site/robots.txt` updated as pages are added.

## Open questions / TODO
- **Ask @yvan** about the AI tool to build page structure + `.css` (to standardize how new
  pages and their CSS are generated). Resolve before scaling out the page set.
