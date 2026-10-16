# Architecture

The site is a static Astro 7.4.0 application targeting `https://naahiv.github.io/`. Node 24.19.0 and the committed npm lockfile define its JavaScript toolchain. The published files are ordinary HTML, CSS, self-hosted fonts, and small progressive-enhancement scripts. Reading, mathematics, navigation, reference links, and all portfolio entries are present before client JavaScript runs. There is no account system, comment service, application server, database, analytics, or external math-image dependency.

## Content and rendering

`src/content.config.ts` uses Astro's custom content loader to call `compilePosts`. The compiler uses gray-matter and Zod for frontmatter and unified/remark for Markdown syntax, GFM, math, and the small documented directive extension. Normal posts remain Markdown; MDX is not required. Frontmatter fixes the URL through a stable `slug` independently of the title/date. The content layer validates dates, slugs, tag syntax, draft/specimen status, and optional ordered series metadata.

References are a two-pass operation over the parsed document tree:

1. Parse the included posts and register their stable slugs. Walk each tree to collect section, theorem-like, equation, and diagram labels. Theorem-like blocks share one per-article counter; labeled equations and diagrams have separate counters. Proofs and explicitly unnumbered blocks are unnumbered.
2. Resolve local, forward, and cross-post references against the complete registry, render math/diagrams, process intended post assets, and generate HTML. Duplicate labels, missing targets, unknown macros, malformed content, and missing assets fail with source locations where available.

Displayed numbering can change when an earlier result is inserted; the author-chosen semantic ID does not. Links are normal URLs/fragments, so copied references and direct page loads need no JavaScript. Explicit stable IDs are recommended for sections that other content references. The resolver never tries to recover document structure from generated HTML.

KaTeX produces article mathematics at build time as visual HTML plus MathML. Its fonts are self-hosted. MathJax is a development-only comparison dependency and is not shipped as a second production renderer. The chosen approach and tested compatibility profile are documented in `docs/math-rendering.md`. Shared notation lives in `src/data/math-macros.tex`; a fresh per-post context applies intentional local definitions/overrides without leaking macro state between posts. The legacy public `quiver-macros.tex` remains an unchanged source artifact rather than an unrestricted browser-math preamble.

## Native diagrams

`src/lib/content/diagrams.mjs` compiles genuine `tikzcd` source with TeX Live and the PGF dvisvgm driver, then converts DVI to transparent SVG using `dvisvgm --no-fonts`. Shared and local compatible math macros enter the native preamble. The pipeline tests real arrow varieties and shared notation; it does not translate TikZ to a substitute diagram language.

Each compilation uses an isolated temporary directory, disabled shell escape, a deliberately restricted environment, wall-clock bounds, and Linux resource limits. Repository authors are trusted to supply TeX; this is not a public submission endpoint. The cache includes source, macro definitions, package/profile hashes, compiler/converter versions, and conversion options. CI removes the cache before rebuilding the demanding article; a checked-in generated SVG is never the source of truth.

The SVG parser rejects active/external content, prefixes IDs, updates internal references, adds padding, and supplies an authored description. Inline vector diagrams retain crisp paths but their labels are not selectable text, so prose descriptions and source disclosures accompany them. Wide formulas and diagrams use focusable local scrolling regions instead of shrinking all math or widening the page. See `docs/diagrams.md` for native installation details and limits.

## Portfolio and public assets

`src/data/portfolio.json` is the single live record list, kept in the author's intentional order. Original `kind` values remain intact; an added normalized category fixes Notes & surveys filtering. Astro renders the full list, then small browser scripts enhance searching/filtering. Root PDFs, the portrait, and the public TeX file remain canonical at their original tracked paths. An explicit 19-file manifest stages them into the ignored `.generated/public` directory; the entire repository is never a public directory.

Current-content checks compare each served asset with its current canonical source. The opt-in frozen baseline separately certifies this redesign migration. An ordinary future PDF refresh changes only its root PDF and the corresponding page count in the metadata file. See `docs/migration.md` for the full contract and simulated-refresh test.

## Publication boundaries

Production builds write `dist`; explicit draft previews write `dist-preview`. Drafts are filtered before rendering and asset generation, so their pages, text, tags, feed items, search entries, and post assets are excluded from production. Development specimens remain clearly labeled drafts. This website exclusion does not make committed draft source private in a public repository. Since no real post has been approved, production has a purposeful empty blog state.

Search indexes use plain prose/metadata extracted from the document tree, excluding duplicate renderer/MathML internals. RSS contains canonical links and readable summaries. Tag/archive pages, sitemap, canonical/social metadata, a useful 404, print styles, and previous/next navigation remain static output. Search is text search, not semantic mathematical search.

The only enabled GitHub workflow validates builds and browsers with read-only repository permissions. It has no Pages environment or deployment job. Current production remains the legacy `master:/` website; later publication requires the explicit source transition described in `docs/deployment.md`.

## Verification and tradeoffs

Node tests exercise compiler failures, reference integrity, macro isolation, native diagram rebuilding/cache invalidation, SVG IDs, and asset preservation. Playwright checks Chromium, Firefox, and WebKit at 320, 390, 768, and 1440 CSS pixels, with draft/production servers separated to expose publication leaks. Browser evidence includes screenshots, accessible structure checks, JavaScript-disabled reading, blocked third-party requests, local scrolling, direct fragments, and print/reflow behavior. The final recorded results and remaining manual checks are in `docs/browser-review.md` and `docs/progress.md`.

The main maintenance cost is installing native TeX for diagram builds; the resulting deployed site needs none. Build-time custom code is limited to the supported authoring profile, references, asset handling, and diagram compilation. Arbitrary complete TeX-document ingestion and complete package parity are explicitly outside this profile. Automated MathML/accessibility checks do not establish screen-reader usability; physical devices and representative assistive technology require a separate manual review.
