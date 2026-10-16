# Implementation progress

**Status: complete for development-branch review.** The implementation, authoring workflow, mathematical prototype, migration, browser tests, and evidence are complete. Production has not been changed. Start with [review.md](review.md).

## Authorization and repository state

Work remains on `codex/math-blog-revamp`. No merge, push, PR, production deployment, or Pages-setting change was performed. The starting checkout branch `work` was clean. Both supplied documents were read completely before implementation and retained under `docs/source/`.

Initial and final read-only checks confirmed latest remote master/default branch at `2023f42de108f45f50807016494402ad7212fd35`. Pages remains legacy source `master:/`, domain `https://naahiv.github.io/`, HTTPS enabled. Existing work was not overwritten. The development branch has no upstream configured, to avoid accidental publication to master.

## Completed milestones

1. **Baseline and mathematical prototype:** frozen asset/metadata audit, branch/toolchain, dense and short specimens, two typography treatments at desktop/phone sizes, actual KaTeX/MathJax 4 comparison, native TikZ-CD from empty cache, shared/per-post macros and semantic references.
2. **Shared site and portfolio:** all 18 records and intentional order preserved; 17 PDFs/10,727,259 bytes plus portrait/macros unchanged; normalized notes/surveys filters; repaired Caltech contact; fully static listing and legacy anchors.
3. **Blog and authoring:** post/topic/archive routes, prose search, RSS/sitemap/metadata/404, drafts and public-asset isolation, semantic theorem/proof/equation/diagram/cross-post references, starter CLI/template, authoring and bounded TeX-conversion guides.
4. **Verification and refinement:** 29 node tests (28 pass; optional frozen check separately passes), 12 first-publication integration checks, 7/7 preservation checks, clean dependency install/build, live dev add/edit/delete, native cache invalidation, **54/54 browser checks** across Chromium/Firefox/WebKit at 320/390/768/1440, zero axe violations without excluding math, no-JS/offline/keyboard/touch/print/reflow, desktop/mobile screenshots and final visual review.
5. **Reviewable delivery:** local source commit, exact changed paths, retained evidence/screenshots, prebuilt preview/source/diff bundles under ignored `work/delivery`, deployment/rollback instructions, durable continuation record. No public staging or live deployment.

## Decisions worth retaining

Static Astro 7.4.0 on Node 24.19.0. Source Serif 4 reading text with Inter navigation. KaTeX 0.19.0 HTML+MathML is the sole production renderer; actual MathJax 4.1.3 successfully rendered the same 70-formula corpus but produced more markup. Custom Astro loader validates documents in two AST passes and watches post/assets/macros during development.

Native diagrams use genuine TeX Live and dvisvgm. Installed TikZ rejected the proposed `[dvisvgm]` option; the tested explicit `pgfsys-dvisvgm.def` driver is used. Tight preview bounding boxes replaced loose `--bbox=min` results. SVG IDs include the original semantic ID hash, preventing colon/hyphen normalization collisions. Credentials are absent from compiler environments; shell escape is disabled and resource/time limits apply.

Root assets remain canonical and only the explicit manifest is staged. `src/data/portfolio.json` is the single editable portfolio source. Historical baseline/evidence files are not editable metadata. Ordinary future PDF refreshes compare current source to output, not frozen migration hashes.

Font preloading plus optional prose-font swaps reduced measured delayed-font CLS from about 0.20/0.22 to 0.001/0.013. Scroll hints update through a coalesced animation frame, avoiding a real WebKit ResizeObserver delivery warning caught in final testing.

## Verification and known limits

See [verification.md](verification.md), [browser-review.md](browser-review.md), and `docs/evidence/` for commands and exact results. GitHub-hosted CI has not run because nothing was pushed; validation-only CI is configured. Screen readers, physical devices, physical print drivers, and native Windows TeX are not verified. Linux/Cloud builds and emulated touch are verified; WSL is documented for Windows.

The designated `/codex/.../output` export folder is unavailable in this environment. Review evidence stays in the shared repository (`docs/evidence`) and prebuilt bundles in `work/delivery`; this is an artifact-delivery limitation, not a build limitation.

## Next concrete action

Review `docs/review.md` and the screenshots, or run `npm run build:preview` then `node scripts/serve.mjs dist-preview 4321`. Inspect `/blog/mathematical-writing-specimen/` and `/blog/a-small-pullback/`. Production `npm run build` intentionally has no published posts. Follow `docs/authoring.md` to create a real draft.

No further implementation is currently pending. Only after separately authorized publication should a worker recheck remote state, propose the exact reviewed commit, switch Pages from legacy master:/ to the documented Actions process, and deploy production `dist/`. Never deploy `dist-preview/`; preserve the rollback baseline and settings.
