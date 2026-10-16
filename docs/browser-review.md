# Browser and visual review

Final result: **54/54 browser tests passed in 36.3 seconds** on 2026-10-16. The final run reported no JavaScript page errors and no axe WCAG A/AA violations on the tested pages.

## Reference inspection

On 2026-10-16, opened the actual Stacks [Total direct image](https://stacks.math.columbia.edu/tag/08DY) and Kerodon [The Language of infinity Categories](https://kerodon.net/tag/0001) pages in Chromium at 1440 and 390 CSS pixels. Screenshots are under `work/screenshots/reference-*.png` (review artifacts, not committed site content).

The useful characteristics are integrated math on the surrounding white background, modest labels for mathematical results, ordinary stable reference links, and an uninterrupted reading column. Stacks used 14px/21px Droid Sans and Kerodon 15px/22.5px Roboto on the inspected pages. These are observations, not target values: the new blog starts at a larger body size for reading comfort. Kerodon removes its secondary navigation on phones; its justified mobile prose sometimes creates large spaces around inline mathematics. Prefer ragged-right prose in this design.

## Early article typography comparison

Rendered the same complete mathematical specimen with Source Serif 4 and with an Inter body override at 1440 and 390 CSS pixels. The comparison retains identical font sizes, math rendering, content, and spacing, so it isolates the body font choice. Screenshots are `work/screenshots/prototype-{serif,sans}-{top,proof}-{1440,390}.png`, with full-page and diagram details beside them.

Selected Source Serif 4. Its weight, baseline, and letterforms sit comfortably beside KaTeX; Inter is clean but makes the change from prose to mathematical symbols more noticeable. Keep Inter for navigation, metadata, captions, and controls. The specimen contained 72 MathML formulas and two native diagrams; at 390px the page width remained exactly 390px. Native diagrams use font-relative dimensions and readable natural widths. The desktop theorem and proof treatments remain part of the continuous article instead of separate cards.

The initial mobile review identified an open table of contents that placed the first article paragraph around 880px down the page. The final mobile contents list is collapsed initially, and the compact header brings the first paragraph into the initial screen. The early review also caught mismatched equation-wrapper CSS and diagram class names; these were corrected before the typography comparison.

## Test procedure

Activate the prepared native/browser environment if using this Cloud workspace:

```sh
source /workspace/portfolio-toolchain/activate.sh
```

Build draft and production outputs, then run `npm run test:browser`. Playwright starts `scripts/serve.mjs` for both outputs automatically, or reuses an existing local server. The default origins are draft preview `http://127.0.0.1:4321` and production `http://127.0.0.1:4322`; override with `PREVIEW_URL` and `PRODUCTION_URL`.

The suite covers Chromium, Firefox, and WebKit and explicitly visits widths 320, 390, 768, and 1440 CSS pixels. It is intended to verify generated pages rather than a development server. Browser artifacts belong in `work/` and are not committed as source.

## Final acceptance coverage

The suite has 54 cases: 18 per engine, using pinned Playwright 1.62.1 with Chromium 151, Firefox 153.0, and WebKit 26.5. Every engine visits the portfolio, papers page, blog index, dense mathematical specimen, and short specimen at 320, 390, 768, and 1440 CSS pixels. Tests assert no page-wide horizontal overflow and no JavaScript page errors.

Additional acceptance checks cover:

- All current portfolio records and their canonical order, normalized Notes & surveys filtering, metadata search, empty results, the linkless Part 2, and Part 1's two PDF links.
- Blog prose search and empty results, topic/archive navigation, search-network failure fallback, stable trailing-slash post URLs, direct theorem fragments, and refresh.
- Full math/portfolio rendering without JavaScript and with third-party requests blocked; failed font loading leaves the layout usable.
- HTML/MathML presence, native SVG titles/descriptions and internal ID references, keyboard scrolling of long formulas and diagrams, and an independently visible equation number.
- Touch activation of diagram-source disclosures in all three engines. Chromium additionally performs a synthesized horizontal touch swipe in the overflowing native gallery at 320px. At 390px that diagram naturally fits, so a horizontal swipe should not move it.
- Skip navigation and existing portfolio/about/contact fragments, 200% desktop reflow via a 720px CSS viewport, and a separate doubling of article text size.
- Production absence of both specimen routes and their entries in search, RSS, sitemap, and blog listings.
- Axe WCAG 2 A/AA and 2.1 AA checks on papers, blog, and the mathematical article, with no blanket MathML exclusions.
- Print CSS in all engines and a six-page A4 Chromium PDF.

The review fixed a real accessibility defect in TeX equation references: anchors inside KaTeX's aria-hidden visual branch were replaced with ordinary semantic links. It also found a WebKit ResizeObserver delivery loop in scroll-hint generation; updates are now coalesced in animation frames and observe the actual scroll regions. Neither finding was suppressed in the tests.

## Final visual review and evidence

Inspected the home, papers, blog, production empty state, long article title, dense inline math, theorem/proof blocks, equation numbers, long expressions, footnotes, native diagrams, and print output. The article was inspected on desktop and phone; additional Firefox and WebKit phone proof screenshots confirm comparable typography and readable local scrolling. Native labels were moved apart where the early gallery overlapped; the final long label, parallel-arrow labels, and objects remain distinct. Formulas and transparent SVGs share the page background, with no visible clipping or missing glyphs in the reviewed samples.

Representative artifacts under `work/screenshots/`:

- `final-home-top-{1440,390}.png`, `final-blog-top-{1440,390}.png`, and `final-production-empty-blog-{1440,390}.png`.
- `chromium-portfolio-{1440,390}.png` and `chromium-papers-{1440,390}.png` show full portfolio pages.
- `{chromium,firefox,webkit}-article-{1440,390}.png` show complete mathematical articles.
- `final-article-top-{1440,390}.png`, `final-article-proof-{1440,390}.png`, and `final-{firefox,webkit}-article-proof-390.png` show reading details at useful display sizes.
- `{chromium,firefox,webkit}-tikzcd-{1440,390}.png` and `final-arrow-gallery-{1440,390}.png` show the native diagrams.
- `article-print.pdf`, `final-print-page-1.png`, and `final-print-page-5.png` record print inspection. The PDF is a print preview, not a separately tagged accessible publication.

Full test output is `work/browser-tests-final.log`; the Playwright HTML report and attached axe results are in `work/browser-report/`. Generated artifacts are review evidence rather than repository source.

## Transfer and font-loading measurements

Cold Chromium measurements use the local static server without HTTP compression. Values are decoded bytes; total includes images, fonts, search JSON when requested, and the HTML. Inline JavaScript is already included in HTML and is not added twice. No separate JavaScript file or browser equation-rendering runtime is requested.

| Page | HTML | CSS | Fonts | Inline enhancement JavaScript | Total fetched content |
| --- | ---: | ---: | ---: | ---: | ---: |
| Portfolio | 19,898 | 18,878 | 92,476 | 773 | 431,302 |
| Blog preview | 5,485 | 18,878 | 92,476 | 910 | 125,354 |
| Dense specimen | 196,029 | 48,709 | 243,432 | 883 | 488,170 |

The existing portrait accounts for most portfolio image weight and is retained unchanged. Dense article HTML contains build-time math and vector diagrams; this avoids requiring a client math runtime. These are representative local measurements, not a promise about remote latency or compressed CDN transfer sizes.

Artificially delayed all font responses by 1,200ms at 1440 and 390px. The initial font-swap behavior caused visible shifts; prose fonts now use preloading and optional display. Final observed layout-shift sums were approximately 0.0011 desktop and 0.0131 phone, with unchanged title height and article starting position. Math fonts remain self-hosted and load normally. Detailed resource and shift records are in `work/browser-performance.json`; inline script sizes are in `work/inline-javascript.json`.

## Limits of verification

Headless browser engines are not physical iOS/Android devices. The 200% reflow check uses a half-width CSS viewport; it does not establish browser chrome zoom behavior on every device. Print emulation and rasterized Chromium PDF pages were inspected, but print drivers vary.

MathML presence and automated accessibility checks do not prove mathematical screen-reader usability. No NVDA, JAWS, VoiceOver, or physical touch-device review has been performed in this environment. These remain explicit manual checks before publication.
