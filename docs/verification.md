# Verification report — 16 October 2026

The implementation is reviewable on `codex/math-blog-revamp`. Production remains unchanged: the latest remote master is still `2023f42de108f45f50807016494402ad7212fd35`, and the read-only Pages API still reports legacy `master:/`. No source was pushed, no PR was opened, and no production workflow or Pages setting was enabled.

## Source and build checks

- `npm test`: **29 tests, 28 passed, zero failures**. The one optional frozen-migration test is skipped in ordinary runs so future PDF updates are allowed. It was separately enabled and passed in the **7/7** preservation suite.
- `npm run test:release`: **12 integration checks passed**. An isolated copy uses the actual new-post command/template, publishes one temporary fixture, compiles native TikZ-CD, and verifies its route, canonical URL, tag/archive listings, RSS, search, sitemap, and copied local asset. Draft fixtures and repository source stay excluded. The temporary source is removed; no real post is published.
- `npm run build` and `npm run build:preview`: pass. Production has five HTML pages and an intentional empty blog. The review build has nine HTML pages including the two clearly marked specimens and their topic pages.
- A clean source snapshot without dependencies, build output, or cache completed `npm ci` (302 locked packages), production build, draft build, and frozen preservation verification. The snapshot is an installation/build check, not another canonical source tree.
- The full specimen was rebuilt after moving its entire diagram cache aside. Native tests also independently rebuild from empty temporary caches and prove that changing a macro invalidates the result.
- The Astro custom loader was exercised live: adding, editing, and deleting a temporary draft updated the served route in roughly 0.9s, 0.7s, and 0.9s without restarting. The fixture was removed.
- Validation-only GitHub CI is configured with read-only permissions and no deployment job. Its commands have been exercised locally; **GitHub-hosted CI has not run**, because this branch has not been pushed.

The local Astro build stage takes about 1–2 seconds for this small site; shell startup/npm overhead and installing dependencies are additional. Native first-time diagram builds add toolchain work; cached builds reuse only raw generated SVG, then always namespace and validate each embedding.

## Preservation

All **18 portfolio records** retain the exact original content and intentional order. The original `kind` is retained; an added normalized category makes all **14** notes/surveys appear in that filter. The linkless Part 2 and the single Part 1 record with two PDF links are preserved. Contact points to the active Caltech address.

All **17 PDFs**, totaling **10,727,259 bytes**, match the frozen migration SHA-256 baseline. The portrait and public `quiver-macros.tex` also match. Both static builds pass current-source and frozen-baseline checks. HTTP requests to **all 19 original asset URLs** on both preview servers return 200 with matching source hashes.

The simulated PDF-refresh test changes only a canonical PDF and `src/data/portfolio.json`; current-source checks accept that change while frozen migration certification correctly detects it. No PDF was edited or recompiled for this implementation.

## Browser and visual checks

**All 54 browser cases passed** across Chromium, Firefox, and WebKit. Axe found zero WCAG A/AA violations without excluding mathematical content. See [browser-review.md](browser-review.md) for the complete matrix and exact result. Coverage includes 320, 390, 768, and 1440 CSS pixels; full article and portfolio with JavaScript disabled; blocked third-party requests; normalized filters; prose search and failure fallback; tags/archive/series; nested routes and direct fragments; SVG semantics, ID references, and local keyboard/touch scrolling; automated axe; enlarged text/reflow; and print.

Desktop and phone layouts were inspected as images, including the complete article, proof/equation sections, both diagrams, portfolio, draft index, and production empty state. The medium article is original elementary exposition and the short article is conversational; neither is represented as an approved post by the author. The six-page A4 proof was inspected, including the longest equation and arrow gallery, without clipped labels or arrowheads.

Two article typography treatments were compared on the same content. Source Serif 4 was selected for reading, with Inter for navigation and metadata. Both KaTeX 0.19.0 and actual MathJax 4.1.3 rendered the same **70-formula** corpus successfully with MathML; KaTeX produced substantially smaller formula markup. Details, reproducible commands, and measured limitations are in [math-rendering.md](math-rendering.md).

## Performance and font loading

Representative cold local loads are approximately **431 KB** for the portfolio (including the unchanged 300 KB portrait), **125 KB** for the preview blog index, and **490 KB** for the demanding article, including decoded HTML, CSS, and fonts. These are local uncompressed resource sizes, not network-speed or Lighthouse claims. There is no hydrated application or runtime math engine; the small interaction scripts are included inline. Exact measurements are in the evidence files.

An artificial 1.2-second font delay initially caused a noticeable shift. Preloading the primary local fonts and using `font-display: optional` for prose/UI fonts reduced measured CLS from about **0.20/0.22** to **0.001/0.013** on desktop/phone. Slow connections may retain a readable fallback font for that navigation rather than swap late. KaTeX's required mathematical fonts remain self-hosted and keep their renderer's sizing model.

## Remaining manual checks and deliberate limits

- Headless Chromium/Firefox/WebKit and emulated touch are verified; physical iOS/Android devices, browser-chrome zoom on every platform, and physical print drivers are not.
- MathML, semantic descriptions, keyboard behavior, and automated axe were checked. **NVDA, JAWS, and VoiceOver have not been tested**; MathML presence is not proof of mathematical screen-reader usability.
- Linux/Cloud native builds are verified. WSL is the documented Windows route; a native Windows TeX installation is not verified.
- The draft flag is a website-publication boundary, not repository privacy. Committed source in this public repository remains public.
- The authoring profile is explicit, not arbitrary whole-package LaTeX parity. Bibliography automation, hover reference previews, dark mode, comments, accounts, and a CMS are not part of this release.

## Evidence and reproduction

`docs/evidence/` retains the final textual checks, asset manifests, and selected review screenshots. These are historical review evidence, never build inputs or editable site metadata. Generated site output, caches, browser traces, and temporary fixtures remain ignored in `work/`, `dist/`, and `dist-preview/`.

```sh
npm ci
npm test
npm run test:release
npm run build
node scripts/verify-preservation.mjs --baseline
npm run build:preview
npm run test:browser
```

Activate the documented native toolchain first. See [authoring.md](authoring.md) for authoring and [deployment.md](deployment.md) for the separately approved future production transition and rollback.
