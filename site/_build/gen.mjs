// gen.mjs — stamp shared partials (header/footer) into every page.
//
// Source of truth: site/partials/header.html and site/partials/footer.html.
// Each page marks where a partial goes with a pair of HTML comments:
//
//     <!-- @include:header --> ... <!-- @endinclude:header -->
//     <!-- @include:footer --> ... <!-- @endinclude:footer -->
//
// Running `node _build/gen.mjs` replaces whatever is between each marker pair
// with the current partial. The partial ends up INLINE in the committed HTML,
// so the nav + footer links stay in the crawled markup (SEO-safe) — no runtime
// fetch/JS. Edit the partial, re-run, done.
//
// Usage:  cd site && node _build/gen.mjs
//
// NOTE: partials use root-relative asset paths (images/..., css/...), which are
// correct for pages at the site root. When pages/ subpages are added, extend
// this script to rewrite `href="images/` -> `href="../images/` for that folder.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'); // site/

const partials = {
  header: readFileSync(join(root, 'partials', 'header.html'), 'utf8').trim(),
  footer: readFileSync(join(root, 'partials', 'footer.html'), 'utf8').trim(),
};

// Pages: every *.html at the site root (add pages/ when it exists).
const pages = readdirSync(root)
  .filter((f) => f.endsWith('.html'))
  .map((f) => join(root, f));

const pagesDir = join(root, 'pages');
if (existsSync(pagesDir)) {
  for (const f of readdirSync(pagesDir)) {
    if (f.endsWith('.html')) pages.push(join(pagesDir, f));
  }
}

function stamp(html, name, content) {
  const re = new RegExp(
    `(<!-- @include:${name} -->)[\\s\\S]*?(<!-- @endinclude:${name} -->)`
  );
  if (!re.test(html)) return { html, changed: false };
  return { html: html.replace(re, `$1\n${content}\n$2`), changed: true };
}

let total = 0;
for (const page of pages) {
  let html = readFileSync(page, 'utf8');
  let touched = false;
  for (const [name, content] of Object.entries(partials)) {
    const res = stamp(html, name, content);
    html = res.html;
    touched = touched || res.changed;
  }
  if (touched) {
    writeFileSync(page, html);
    total++;
    console.log('stamped', page.replace(root, '.'));
  }
}
console.log(`\nDone — ${total} page(s) updated from partials/.`);
