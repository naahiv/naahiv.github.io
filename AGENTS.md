# Repository working contract

Read docs/progress.md before resuming. The complete requested brief and prior audit are in docs/source/; treat them as project requirements subject to the user's current instructions.

- Work on codex/math-blog-revamp. Never merge/push master, change Pages settings, or deploy without explicit user authorization. Current Pages source is master:/ (legacy).
- Node 24.19.0; npm ci. Native TeX Live (standalone, tikz-cd, amsmath, amssymb, mathtools, mathrsfs) and dvisvgm are required for diagrams. In this cloud workspace run `source /workspace/portfolio-toolchain/activate.sh` before native/browser commands.
- `npm run dev`, `npm run build`, `npm run build:preview`, `npm test`, `npm run test:browser`, `npm run verify`. See docs/authoring.md for final author workflow.
- Root PDFs, profile.jpg, and quiver-macros.tex are canonical and must retain their URLs and bytes. Only an explicit allowlist is staged; never use the whole repository as publicDir.
- src/data/portfolio.json is the sole editable portfolio metadata source. Preserve all 18 records and their intentional ordering; Part 2 has no PDF, Part 1 has two links.
- Markdown posts live in src/content/posts. Mathematical structures and references resolve during the build; unknown commands, duplicate/missing labels, and failed diagrams must fail. Native TikZ-CD uses disabled shell escape and bounded isolated temporary builds. Never silently substitute arrows or notation.
- Specimens/drafts are excluded from production routes, feeds, search, sitemap, and assets. Committed drafts in this public repository are not confidential.
- Keep docs/progress.md current with checks, results, remaining work, and a next action. Generated files, caches, and browser reports are not sources of truth.
