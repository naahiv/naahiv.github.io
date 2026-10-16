# Mathematics portfolio and blog implementation handoff

Build a revamped version of Vihaan Dheer's website in the GitHub repository naahiv/naahiv.github.io. Preserve its academic portfolio and add a modern mathematics blog. The blog is for short and medium posts about the author's mathematics, with excellent typesetting and a comfortable reading experience on phones, tablets, and computers.

This brief is intended to drive implementation through a complete, reviewable result. Resolve ordinary engineering choices yourself, maintain a durable progress record, and verify the rendered site throughout the work.

## Confirmed direction

The author will write Markdown with LaTeX mathematics. Support reusable definitions using familiar commands such as \newcommand, theorem/proof structures, numbered results and equations, cross-references, and the author's usual TikZ-CD diagrams. Converting passages from existing TeX with Codex later is acceptable. Automatic ingestion of arbitrary complete TeX documents is not required.

The first release has no reader comments or accounts. Deliver a focused blog with an index, posts, tags, search, and RSS. A browser CMS, email newsletter, analytics, subscription service, and backend database are outside the initial scope.

Use these references in the following ways:

- The Stacks project is a positive reference for integrated mathematical text, understated theorem/proof presentation, stable references, and useful navigation. Inspect a real reading page, for example [Total direct image](https://stacks.math.columbia.edu/tag/08DY).
- Kerodon is another positive reference for the look, feel, and functionality of mathematical reading. Inspect [The Language of infinity Categories](https://kerodon.net/tag/0001).
- Akhil Mathew's [Quillen-Suslin blog post](https://amathew.wordpress.com/2012/01/16/the-quillen-suslin-theorem/) illustrates the kind of exposition the author wants to publish. The author dislikes its old presentation, font treatment, formatting, and math that looks visually detached from its surrounding background.

Create an individual blog informed by these references. Preserve their reading clarity without importing their textbook hierarchy, logos, content, or entire implementation. Posts should feel like dated blog articles rather than chapters in an enormous reference work.

## Repository baseline and preservation contract

Read REPOSITORY_AUDIT.md and inspect the current checkout. The planning audit found master at 2023f42de108f45f50807016494402ad7212fd35 on both local and remote repositories on 16 October 2026. Treat this as a baseline to revalidate, not a reason to overwrite later work.

The site currently consists of index.html, styles.css, script.js, root PDF files, a portrait, a macro file, and README.txt. It has 18 manually ordered work entries. The author adds/replaces PDFs and edits a simple metadata record. Preserve that ease of maintenance.

Required preservation:

1. Retain all 18 records, their content, chosen order, statuses, page counts, publication details, and scholarly external links. Do not silently reorder by date or title.
2. Keep the Part 2 stable infinity categories entry visible with no download link until one actually exists.
3. Keep the Part 1 derived categories entry as a single record with both its regular PDF and Book PDF links.
4. Preserve all 17 existing root PDF URLs and their bytes. Preserve the portrait and public quiver-macros.tex file. Do not edit or rebuild these PDFs.
5. Keep the home page, accessible contact information, résumé, biography, and papers/notes browsing. Preserve useful existing fragments such as /#work, /#about, and /#top, even if new dedicated pages are introduced.
6. Keep a single canonical source for each PDF and a single authoritative metadata entry. Do not create duplicate tracked copies that confuse the existing local publishing workflow.
7. The local PDF publisher discovers a tracked PDF by its exact leaf filename and then locates its associated page-count record. It expects a normal PDF refresh to change only that PDF and its metadata file. Preserve this practical contract and document the new metadata location.

Prefer keeping the existing root PDFs as the canonical source assets. A build step can copy an explicit manifest of them into an ignored static staging directory and then the output root, with identical bytes and URLs. Do not set the entire repository as the public directory: source, tests, logs, and local files must not be deployed accidentally. Verify these copied assets in both development and production previews.

Frozen baseline hashes certify this redesign migration. Ongoing tests must compare the current canonical PDF with its built/served output, so later authorized PDF updates do not fail against an obsolete golden hash.

Fix two existing defects as part of the migration: the Notes & surveys filter currently omits entries whose kind is notes or survey, and the Contact navigation target is commented out. Use the active Caltech contact information; do not restore the stale Berkeley address from commented HTML.

## Architecture

Use a static Astro site as the initial architectural choice. Keep the published result as ordinary HTML, CSS, static assets, and modest progressive enhancements compatible with GitHub Pages. Build-time content collections can validate post and publication metadata. Ordinary reading, navigation, portfolio entries, and core math should work without client-side application hydration. [Astro content collections](https://docs.astro.build/en/guides/content-collections/)

Use Markdown for ordinary posts. Add a small documented extension for mathematical blocks and diagrams where necessary. Use MDX only for an explicitly interactive post, not as a requirement for normal mathematical prose.

Prefer mature packages for parsing and rendering. Keep project-specific code concentrated in content validation, reference resolution, diagram compilation, and the site's visual components. Do not build a general-purpose CMS, a new TeX interpreter, or a large application framework.

Choose maintained compatible dependency versions when implementation begins and pin them with a lockfile. Record the Node version and native TeX tools. Check current documentation for the installed Astro version; do not paste old content-collection APIs without validating them.

Suggested separation of responsibilities:

- Site layout and navigation.
- Portfolio metadata and rendering.
- Post metadata, source files, and colocated assets.
- Markdown parsing, mathematical blocks, labels, and reference resolution.
- Ordinary equation rendering.
- Native TikZ-CD compilation and SVG processing.
- Search/feed/sitemap generation.
- Content validation and browser/visual tests.

A folder layout might include src/pages, src/layouts, src/components, src/content/posts, src/data, src/lib/content, src/styles, scripts, tests, and docs. Adapt names to the chosen Astro version. The author should never need to understand this internal structure just to add a normal post.

## Mathematical rendering decision

Make an early prototype using real mathematical structures before deciding the equation engine and fonts. Evaluate build-time KaTeX and a current MathJax integration on the same specimen. Choose one production engine for normal article math; avoid shipping both globally.

KaTeX is a strong lightweight candidate and supports custom macros and HTML with MathML. It does not itself provide document-level \label and \eqref handling. A KaTeX solution must implement and test references in the content pipeline. [KaTeX options](https://katex.org/docs/options), [support table](https://katex.org/docs/support_table.html)

MathJax supports equation numbering and references, and may reduce adaptation of the author's notation. Verify the actual installed version and output/accessibility behavior. Adding a package named rehype-mathjax does not establish that its underlying renderer is MathJax 4. [MathJax numbering](https://docs.mathjax.org/en/v4.0/input/tex/eqnumbers.html), [plugin dependency manifest](https://github.com/remarkjs/remark-math/blob/main/packages/rehype-mathjax/package.json)

Select on demonstrated typography, compatibility, mobile behavior, accessible output, reproducibility, and maintenance cost. Record the decision briefly in docs/math-rendering.md. Do not keep researching engines after a viable choice satisfies the specimen.

For normal mathematics:

- Support inline math and display blocks delimited by double dollar signs.
- Match the surrounding text's visual size and weight. Formulas must sit naturally on the baseline, on the same background, without image-like rectangles.
- Render ordinary formulas as HTML/MathML or an accessible vector output supported by the chosen engine. Do not turn each equation or an entire article into PNGs.
- Handle math in headings, lists, theorem statements, captions, and footnotes. Generate sane plain-text versions for page titles, search snippets, and metadata.
- Use the renderer's sizing model. Avoid global CSS resets on all math descendants, arbitrary transform scaling, and accidental oversized text.
- Produce a useful build error for unknown commands or broken math, including the source file and location when available. Do not ship raw command strings or red error text as if the post had passed validation.
- Self-host the selected fonts and required renderer assets where feasible. Reading must not depend on a third-party equation-image service.

## Macros and package compatibility

Define an explicit supported authoring profile. The author asked for familiar LaTeX functionality, not a promise that every installed TeX package executes in a browser.

Provide a readable site-wide macro file and a per-post macro mechanism. Support familiar \newcommand definitions with arguments, \renewcommand where deliberate overrides are allowed, and \DeclareMathOperator where supported or correctly adapted. Use fresh macro state for each document. Definitions in one post must never affect a different post or depend on build order.

Distinguish:

1. Article math: the actual commands and extensions supported by the chosen browser-math engine plus the site's document-structure layer.
2. Native diagrams: genuine TeX packages and TikZ libraries installed in the build environment.

Begin by testing common notation and relevant features from amsmath, amssymb, mathtools, and mathrsfs, along with the author's macros. Document supported constructs, any equivalents, and the extension procedure. Do not claim whole-package parity merely because a few commands render.

Use shared notation definitions for commands that work in both pipelines, with small explicit adapters for differences. Do not maintain two unrelated copies of every definition. The existing quiver-macros.tex includes package loading and custom arrow definitions, so audit it rather than passing the whole file blindly into KaTeX or MathJax.

Include a specimen showing the same notation in article math and a native diagram side by side. Shared macro source does not guarantee matching glyph shapes, weight, or apparent size.

Conversion must preserve mathematical meaning. Do not silently replace a special arrow with an ordinary arrow, change notation, introduce unnecessary variables, or conflate equality, equivalence, and homotopy. When a construct needs adaptation, document it and preserve its original source.

## Native TikZ-CD support

TikZ-CD is a first-release requirement. Do not satisfy it solely with a simple CD diagram, a hand-drawn SVG, or instructions to export pictures manually.

Support a Markdown diagram block or a referenced small .tex fragment containing familiar \begin{tikzcd} syntax. The author should supply the diagram and its description; the build should generate the rendered asset automatically. Keep the original TeX in the repository.

Start with TeX Live, standalone, tikz-cd, and the PGF dvisvgm driver. Test a minimal wrapper and the following command sequence in Cloud:

In the wrapper, load \usepackage[dvisvgm]{tikz} before \usepackage{tikz-cd}, together with the tested math packages and macro inputs.

~~~bash
latex -interaction=nonstopmode -halt-on-error -no-shell-escape diagram.tex
dvisvgm --no-fonts --bbox=min --output=diagram.svg diagram.dvi
~~~

These are a starting smoke test, not a claim that the wrapper already exists. Verify the PGF driver selection, font compatibility, bounding box, and installed package versions. Use the PGF manual and real package documentation. [PGF manual](https://pgf-tikz.github.io/pgf/pgfmanual.pdf), [standalone](https://ctan.org/pkg/standalone), [tikz-cd](https://ctan.org/pkg/tikz-cd), [dvisvgm manual](https://dvisvgm.de/Manpage/)

If a genuinely needed package requires a PDF-producing engine, add a tested LuaLaTeX/PDF-to-SVG path. Verify the converter's dependencies instead of assuming that TeX installation alone provides working PDF conversion. [dvisvgm PDF conversion notes](https://dvisvgm.de/FAQ/)

Diagram output requirements:

- Transparent SVG, crisp labels and arrows, consistent visual scale, sufficient padding, and no clipped arrowheads.
- Support labels, long labels, superscripts, diagonal arrows, curved arrows, parallel arrows, hooks, two-headed arrows, dashed arrows, and equality arrows in test specimens.
- Use the same mathematical notation macros as the surrounding article where compatible.
- Prefix internal IDs when embedding SVGs inline, updating every corresponding href, xlink:href, and url(#...) reference. Test two diagrams together to catch collisions or lost glyphs.
- Retain source and an authored textual description of the objects, arrows, and commutativity. Path-based glyphs are not selectable text and do not provide adequate semantics by themselves.
- Show wide diagrams in a locally scrollable region at a readable scale, with an optional full-size view. Do not shrink a large diagram until its labels become unreadable.
- Cache using source, shared/post macros, package profile, compiler, converter, and relevant configuration. Changing a macro must invalidate the result.
- In CI, prove the diagram can be rebuilt with an empty cache. A stale checked-in SVG is not proof of a working source pipeline.
- Run TeX in a temporary build directory with shell escape disabled, time/resource bounds, no deployment credentials, and only intended inputs. Treat diagram code as trusted repository authoring, not a future public submission endpoint.
- On failure, fail the build with the diagram source path and useful compiler output.

Simple CD syntax inside display math may also be supported for lightweight diagrams. It supplements the requested native TikZ-CD workflow.

## Theorems and references

Make theorem, lemma, proposition, corollary, definition, remark, example, question, and proof available as semantic document structures. Their prose remains ordinary HTML. Use a restrained label and spacing treatment compatible with the Stacks/Kerodon references. Do not put whole statements inside display math or oversized colored cards.

Use a shared theorem-like counter per article, separate equation numbering, and named unnumbered blocks. Stable semantic IDs must be independent of displayed numbers and survive insertion of earlier results. Provide references to sections, theorem-like blocks, equations, diagrams, and other posts. Define deterministic behavior for forward references.

Resolve labels and references as document structure, not by ad hoc regular expressions over final HTML. Duplicate labels, missing targets, and broken cross-post references must fail validation. Links must work on direct page load, after refresh, with JavaScript disabled, and when copied to another browser.

For ordinary posts, numbered results and equations can be opt-in; a short post with no formal theorem should still feel natural. Provide ordinary linked citations and a References section. If adding BibTeX/citation-key support is straightforward with maintained tooling, include it; otherwise document it as a follow-up rather than inventing bibliography data or blocking the core release.

Reference previews are a useful enhancement if implemented accessibly and within scope. They must work with keyboard focus and touch as well as hover, remain dismissible, and retain a normal link fallback. Stable working links take priority.

## Reading and visual design

Design the article page before polishing the homepage. Use the positive references to establish mathematical reading quality, then give the blog clear identity through its typography, spacing, navigation, and modest use of color.

Produce two limited typography/layout treatments of the same specimen early. Compare them at desktop and phone sizes, select the stronger one, and record the choice. These are working comparisons, not an invitation to build multiple finished themes.

Design requirements:

- Clear header navigation among Home, Papers & notes, Blog, and About/contact.
- A compact article header with title, publication date, optional updated date, topics, and a short introduction.
- A comfortable reading column. Start around 65–80 characters in prose and roughly 18–20 CSS-pixel body text on desktop, then tune against actual formulas; these are starting values, not rigid acceptance thresholds.
- A clean, high-contrast light theme. Choose the body/math font pairing by visual comparison. Do not assume a serif-only article or a formal journal cover is wanted.
- Formulas share the article background and color treatment. No textured page backdrop, equation image boxes, or gratuitous borders around ordinary display equations.
- Sensible vertical rhythm: paragraphs, headings, theorem labels, proofs, displays, and diagrams should read as one continuous exposition.
- A contents list only when the article has enough structure to benefit. Collapse or relocate secondary navigation on narrow screens.
- Footnotes, references, a small previous/next or related-post area, and readable print styles.
- Use restrained motion and honor reduced-motion settings. Avoid a large animated hero, decorative abstract math graphics, and a dashboard-like grid on reading pages.
- The portfolio may retain a light evolution of its current visual identity, but the blog must feel part of the same site.

At narrow widths, prefer meaningful author-specified equation breaks. For an expression that cannot reasonably break, use local horizontal scrolling with keyboard access and a visible cue. Never hide overflow, clip equation numbers, or make the entire page horizontally scroll. Avoid shrinking all math to fit.

Dark mode is optional for the initial release. If included, verify every math and SVG diagram color explicitly: a transparent SVG can still contain black paths. Do not blindly invert colored figures. Prefer a complete light theme to an unreliable second theme.

## Blog and portfolio functionality

The first release should provide:

1. A blog landing page with dated excerpts and a clear route to each full post.
2. A stable post URL such as /blog/descriptive-slug/. The URL should not change merely because the title or publication date is edited.
3. Topic/tag pages, an archive appropriate to the initial post count, and optional series metadata with ordered previous/next links.
4. Lightweight static search of post titles, summaries, topics, and prose. Strip renderer internals and duplicate MathML text from the search index. Do not claim semantic formula search.
5. RSS with canonical URLs and readable summaries; avoid unreadable raw rendering markup in feed excerpts.
6. Sitemap, page descriptions, canonical URLs, social metadata, and a useful 404 page.
7. Draft previews excluded from all production routes, search, tag counts, feeds, sitemaps, and generated public assets.
8. A fully rendered papers/notes listing with search and filters as progressive enhancements. Preserve its manual order and direct PDF access.
9. A sensible empty blog state before the author has approved real posts.

The repository is public. A draft flag prevents website publication; it does not make committed draft source private. Document this distinction and keep confidential drafts outside the public repository.

Do not fabricate posts or mathematical results under the author's name. Development fixtures can demonstrate the design, but must be labeled as specimens and excluded from production. Use original small examples or limited, attributed material. Do not copy the reference blogs' articles into the new site.

## Authoring workflow

Provide a complete starter post and a concise guide that lets the author or a future Codex worker:

1. Create a post with title, slug, date, summary, tags, optional series, and draft status.
2. Write prose with inline/display math.
3. Add shared and per-post new commands.
4. Add a theorem, proof, equation label, cross-reference, footnote, and citation.
5. Add a TikZ-CD diagram and its description.
6. Preview drafts locally and inspect phone-sized output.
7. Validate and build for publication.
8. Replace a portfolio PDF and update its single metadata entry.

Keep the syntax small and show actual tested examples, not pseudo-APIs. A new-post command is useful if it meaningfully reduces mistakes. State which commands run on Windows as well as Linux; the author's current working machine is Windows.

For existing TeX conversion, document a bounded procedure: extract prose and formulas, map macros, convert theorem/reference syntax, preserve diagram sources, inspect output, and report unsupported constructs. Do not imply that changing a .tex extension to .md is sufficient.

## Milestones

### Milestone 1 Baseline and mathematical prototype

Inspect repository instructions, current branch, remote, content, and deployment configuration. Record legacy asset hashes and metadata/order invariants. Prepare the branch and toolchain.

Add a concise repository AGENTS.md with actual build/test commands, the authoring and asset contracts, the math/diagram pipeline, and the publication boundary. Preserve any instructions that already exist. Keep the full design brief and milestone record in docs so future workers can resume without relying on chat history.

Build a specimen article containing dense inline math, nested fractions, script/calligraphic/blackboard letters, long subscripts, aligned displays, numbered statements, proofs, references, a simple CD, and real TikZ-CD diagrams. Include both a short conversational post layout and a medium proof-oriented layout.

Prove the diagram compiler from source. Compare the equation renderer/font choices on the same article. Inspect desktop and mobile screenshots and select the production approach.

Exit criteria: a working article page, demonstrated macros/references/TikZ-CD, saved screenshots, and a justified rendering choice. Do not expand the redesign around unverified placeholder math.

### Milestone 2 Shared site and portfolio

Build the common design and navigation. Migrate all portfolio records, normalize the filter categories, repair contact navigation, and preserve root assets and anchors. Serve the production output and compare metadata and PDF hashes with the baseline.

Exit criteria: all existing portfolio functions/content remain available, with no altered PDFs and no lost URLs.

### Milestone 3 Blog and authoring

Complete post routing, metadata validation, theorem/reference support, the diagram pipeline, tags, search, RSS, drafts, starter content, and the authoring guide. Add accessible reading enhancements that directly serve this use.

Exit criteria: the author can create a representative post entirely through documented source and commands, without editing layout components.

### Milestone 4 Verification and refinement

Run content checks and real browser tests. Visually inspect the complete article, portfolio, blog index, empty states, search, and mobile navigation. Correct layout problems rather than relying only on automated scores.

Review the implementation for stale links, unnecessary dependencies, duplicated metadata, draft leaks, accidental font scaling, inaccessible SVGs, and deployment triggers.

Exit criteria: the acceptance checklist below passes, with honest descriptions of any unverified device/assistive-technology cases.

### Milestone 5 Reviewable delivery

Deliver the source, build commands, authoring guide, screenshots, test results, migration report, and deployment/rollback instructions. Prepare a concise review description and exact changed-path list. Keep production unchanged until publication is explicitly authorized.

Use a durable docs/progress.md with completed milestones, decisions, verification commands/results, unresolved issues, and the next concrete action. If a session ends, leave a working milestone and continuation instructions. Do not mark the whole project complete because only scaffolding or the homepage exists.

Parallelize independent content audit, rendering/toolchain work, design review, and validation if subagents are available. Assign file ownership to avoid simultaneous edits to the same files. One worker owns final integration and acceptance.

## Acceptance checklist

### Build and source

- A fresh checkout installs with documented pinned dependencies and builds successfully.
- The same procedure works in Cloud and CI; Windows authoring instructions are accurate.
- A native TikZ-CD fixture rebuilds from an empty cache, and a macro change rebuilds its output.
- Malformed frontmatter, unknown macros, unresolved references, duplicate labels, missing assets, and failed diagrams produce actionable failures.
- No generated output, cache, or test report becomes an accidental source of truth.

### Preservation

- All 18 portfolio records and their intentional order match the baseline, apart from documented category normalization.
- All 17 root PDFs are served with byte-identical hashes.
- The Part 1 dual links and intentionally linkless Part 2 behave correctly.
- Existing external links and the portrait/résumé/contact workflow are preserved.
- A simulated PDF refresh requires only a PDF replacement plus its metadata update; restore the fixture afterward.

### Browsers and typography

- Test Chromium, Firefox, and WebKit at representative widths including 320, 390, 768, and 1440 CSS pixels.
- Inspect 200% zoom, long titles, dense inline formulas, display alignment, equation numbers, footnotes, theorem/proof blocks, diagrams, and print output.
- No missing glyphs, clipped accents/arrowheads, overlapping labels, page-wide horizontal overflow, accidental giant text, or opaque equation backgrounds.
- Local equation/diagram scrolling works with touch and keyboard.
- Reading remains usable with JavaScript disabled and when third-party network requests are blocked.
- Optional enhancements fail gracefully; ordinary navigation and full article content remain accessible.
- Inspect normal and slow font loading to catch disruptive shifts and fallback-font problems.

### Structure and accessibility

- Semantic headings, landmarks, skip navigation, visible focus, logical keyboard order, and accurate control labels.
- Direct fragment links land at visible targets without being hidden by a sticky header.
- Accessible math output is present. Run an automated accessibility check and manually inspect representative math with a screen reader where available; do not equate MathML presence with proven screen-reader usability.
- Diagram descriptions explain the relevant objects, arrows, and relationships.
- Preview popovers, if implemented, work on touch and keyboard and have ordinary link fallbacks.
- Drafts and their assets do not appear in production output, search, feeds, tags, or sitemap.

### Operation and delivery

- Document the selected renderer, macro profile, native packages, content syntax, and extension path.
- Demonstrate adding a post and updating a PDF using the documented instructions.
- Report build time, representative page sizes, JavaScript transferred, and any meaningful performance limitation. Avoid forcing arbitrary scores at the cost of correct math.
- Include screenshots and test results for the actual final implementation.
- Separate verified checks from remaining manual checks and optional future improvements.

## GitHub Pages and publication

Work on codex/math-blog-revamp or the explicitly selected development branch. Recheck the default branch and actual Pages publishing source. The repository audit found no deployment workflow in its tracked tree; it did not establish the current Pages settings.

Configure the site for https://naahiv.github.io/ at the domain root. Do not mistakenly add /naahiv.github.io/ as a project-site base path. Test direct navigation and refresh on nested post URLs and trailing-slash behavior. [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/)

Separate CI validation from production deployment. Development branches and pull requests should build and test without deploying to the live Pages site. Do not let a workflow_dispatch on a feature branch deploy production. Keep any deploy job restricted to the approved production branch and publication process. If a public staging URL would help, propose its concrete destination and obtain approval before enabling it.

GitHub Pages supports either a selected source branch/folder or a custom Actions deployment. Changing this setting affects the live website, so include the exact change in the publication plan. [GitHub publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Do not push to master, merge, enable production deployment, or change Pages settings without explicit authorization. Follow the user's current authorization for commits, feature-branch pushes, and PR creation; this brief alone does not grant Git publication permission.

Before requesting publication approval, finish the implementation and its evidence. Present the preview, branch/commit or diff, checks, exact deployment change, and rollback procedure. Once approved, verify the actual Pages deployment completes, then inspect the live site and root PDF URLs. Retain a rollback reference to the last working deployment and its configuration.

## Final delivery

Provide:

- A complete implementation on the development branch or as a reviewable workspace diff.
- A working preview or explicit reproducible preview instructions.
- Desktop and phone screenshots of the portfolio, blog index, mathematical article, and TikZ-CD diagrams.
- The starter post and tested authoring guide.
- The math/package compatibility guide and brief architecture decision.
- Migration verification for content, ordering, URLs, and PDF hashes.
- Automated-check results and any remaining manual checks.
- Deployment and rollback instructions, with production still unchanged.

Do not call this finished if TikZ-CD is a placeholder, references are manually numbered, the portfolio has lost entries, the font/layout has only been inspected on desktop, or the build succeeds only by reusing generated files from an earlier run.

