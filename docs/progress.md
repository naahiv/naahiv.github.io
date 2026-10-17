# Implementation progress

## Eight-post publication PR — 2026-10-16

The user approved publication through [PR #2](https://github.com/naahiv/naahiv.github.io/pull/2) from `codex/blog-drafts` to `master`. Exterior Powers 1 and 2, Jennings' theorem, Classical Dold–Kan, Vector bundles on the punctured plane, Quillen–Suslin 1 and 2, and Tannakian Reconstruction now have `draft: false`. The two development specimens remain drafts; the separate unfinished `my-first-post` stays untracked and unpublished. The PR also includes the previously reviewed article formatting, optional diagram metadata, and external working-directory changes. Canonical assets and portfolio metadata are unchanged.

Validation: 33 unit/content tests passed with one optional migration test skipped; all 12 isolated release checks passed; production and preview builds passed; all 57 Chromium/Firefox/WebKit checks passed. Browser checks verify every published route and inclusion in the blog, archive, search, RSS, and sitemap, plus exclusion of every remaining draft. Preservation checks cover all 18 portfolio records and 19 canonical assets. Detailed logs and publication status are in [the external publication record](<C:/Users/vihaa/Documents/Generic testing/website-work/naahiv.github.io/algebra-posts/publication/validation.md>). Next action: review and merge the publication PR after hosted validation; the existing `master` workflow then publishes the site. Earlier entries below record the draft stages.

Hosted validation initially rejected the job-level `runner.temp` expression before starting a job. The work directory is now exported through `GITHUB_ENV` in a runner step, where `RUNNER_TEMP` is available. The publication record tracks the final hosted result.

## Algebra blog drafts — 2026-10-16

Added six unpublished posts on `codex/blog-drafts`: Jennings’ theorem; the classical Dold–Kan correspondence for abelian groups; vector bundles on the punctured affine plane; the two Quillen–Suslin proof parts (Serre’s reduction and Vaserstein’s proof); and Tannakian Reconstruction for Tensor Categories. Source language, notation, and structure are retained, with mathematical gaps repaired, the omitted Horrocks/PID arguments supplied, and the Tannakian theorem hypotheses/examples corrected. The user explicitly asked to keep the completed PID case. Original TeX/PDFs and earlier posts were not edited. Detailed source provenance, corrections, independent reviews, and logs are in [the external validation note](<C:/Users/vihaa/Documents/Generic testing/website-work/naahiv.github.io/algebra-posts/validation.md>).

Validation: 33 tests passed, one optional migration test skipped; draft build and production/preservation checks passed. All six pages passed screenshot-free browser checks at desktop and phone widths, including math font sizes, references, and draft exclusion from production routes/feeds/search/sitemap. `git diff --check` passes. Local preview restored at `http://127.0.0.1:4323/blog/`. Nothing committed, pushed, or published. Next action: user review of the six drafts.

## Working files relocated — 2026-10-16

At the user's request, ancillary working files now live outside the website checkout in `C:\Users\vihaa\Documents\Generic testing\website-work\naahiv.github.io`. Moved all 31 files from `work/` and the Exterior Powers review note, verifying SHA-256 hashes. The three existing post Markdown files were not changed. The preference is recorded in `AGENTS.md` and the designated memory-notes folder. Historical `work/` evidence paths below now refer to this external directory.

`scripts/work-directory.mjs` supplies the external path for preview logs/runtime state, browser reports/screenshots, release-check scratch files, and engine-comparison output. The preview/error-log shortcuts and CI artifact paths use it. The actual website sources and normal build outputs retain their established locations. Verified matching Windows/WSL output paths, rejection of destinations inside the checkout, browser report configuration, JavaScript/PowerShell syntax, unchanged post hashes, and both live draft routes (HTTP 200). The preview restarts and Start safely reuses it; `work/` is not recreated. `git diff --check` passes. Relocation verification and detailed draft notes are external; next action is to review the unchanged drafts.

## Exterior Powers drafts — 2026-10-16

Both unpublished drafts remain on `codex/blog-drafts`: `src/content/posts/exterior-powers-1/index.md` contains §1.1–1.2 before Classical applications, and `src/content/posts/exterior-powers-2/index.md` contains all of §2. The original TeX was not edited. Source provenance, mathematical corrections/deferred points, and verification details are in [the external review notes](<C:/Users/vihaa/Documents/Generic testing/website-work/naahiv.github.io/exterior-powers-review/review-notes.md>); screenshots and the browser report are alongside them.

Prior validation: 33 tests passed, one optional migration test skipped; complete draft and production/preservation builds passed; 24 targeted browser combinations passed. The site estimates 23 and 22 minutes of reading. Nothing was committed, pushed, or published. Local preview: `http://127.0.0.1:4323/blog/`.

## Diagram spacing refinement — 2026-10-16

Diagrams now use the same 0.6em outer spacing as displayed equations, and immediately preceding paragraphs use a matching bottom margin so margin collapse cannot preserve the larger gap. Diagram scroll padding is reduced from 14px to 2px vertically; the TeX source disclosure has a 4px top margin and no bottom margin. SVG dimensions, protective internal padding, and horizontal scrolling are unchanged.

Verified in the running local draft: the gap from the preceding paragraph's box to the SVG box decreased from 52px to about 13px, and the gap after the source control decreased from 38px to about 11px. Visually checked the diagram and adjacent paragraphs (`work/tighter-diagram-spacing.png`); `git diff --check` passed. This CSS-only adjustment updates the live preview immediately. The user's draft and macros were not edited. Changes remain local for review.

## Optional diagram metadata — 2026-10-16

TikZ-CD captions and descriptions are now independently optional, including empty values. A stable `#id` is still required. Omitted metadata creates no caption or description paragraph, and no description is substituted for a missing caption. SVGs retain a generic accessible title; authored descriptions add a `<desc>` and its corresponding accessible reference only when present. Native TeX compilation, SVG sanitization, numbering, references, and source disclosure are retained. The authoring and diagram guides describe the updated syntax.

All 12 focused diagram/compiler tests passed in WSL, including native compilation with omitted/empty descriptions, all four caption/description combinations, valid accessible references, and required stable IDs. JavaScript syntax checks and `git diff --check` passed. The browser assertion now permits optional descriptions; the full browser suite was not rerun. Restarted the local draft preview and visually verified the user's diagram without a description (`work/optional-diagram-description.png`). Removed only the stray `#desc` token from that draft's diagram fence, retaining its existing ID and caption. Changes remain local on `codex/blog-drafts`.

## Error-log shortcut — 2026-10-16

Added `Watch draft errors.cmd` in the original checkout. It opens a live PowerShell view of this checkout's error log, shows the last 20 lines with UTF-8 decoding, and waits for the log if the preview has not created it yet. The viewer explains timestamps and that fixing a post does not erase older errors. Closing it leaves the preview running. Usage is documented in [authoring.md](authoring.md).

## Article formatting update — 2026-10-16

On `codex/blog-drafts`, removed the decorative square at the end of articles. Theorem-like labels now run into the opening paragraph; theorem/definition labels remain bold and proof labels italic. Numbering, named titles, permalinks, and proof-ending squares are retained. Lists, displays, and subsequent paragraphs keep their original block structure.

Four focused compiler/reference tests passed, including a new regression check for run-in labels and list/display-first blocks. The running local preview was restarted to load the compiler changes, and the user's existing draft was visually checked: labels run into the text and the article-end marker is absent. The user's untracked `my-first-post` source was not edited. Changes are local for review; nothing has been published. Preview evidence is in ignored `work/run-in-labels.png`.

Follow-up: the proof-ending square is now inside the final paragraph, so it sits at the right edge of the last text line when space permits and floats below if necessary. Proofs ending in block content retain their existing fallback. Both focused proof/numbering tests passed, and the user's closing sentence was visually verified in the running preview (`work/qed-last-line.png`).

Spacing refinement: theorem-like blocks use 1.6em outer spacing (previously 1.8em), while a statement immediately followed by its proof uses a 0.6em gap. Both adjoining margins are reduced so margin collapse cannot preserve the larger gap. Visually checked in the live draft (`work/tighter-proof-spacing.png`); ordinary paragraph line height is unchanged.

Displayed equations now use the same 0.6em surrounding margin, with internal vertical padding reduced from 12px to 2px. Adjacent paragraph margins and displays with reference links are handled explicitly, preventing compounded gaps. Visually checked against the user's new Background paragraph in the live draft (`work/tighter-equation-spacing.png`); the user's prose and macro edits were preserved.

## Local authoring setup — 2026-10-16

The redesigned website is published at `https://naahiv.github.io/` from merge `b6ac703d850b96a85d25cb4acf98353e229ce45f` ([successful publication](https://github.com/naahiv/naahiv.github.io/actions/runs/38981145193)). The earlier preparation and Cloud records below are historical.

The original Windows checkout at `C:\Users\vihaa\Documents\naahiv.github.io` was fast-forwarded to that release, then switched to local branch `codex/local-authoring-setup`. WSL Ubuntu now has checksum-verified Node 24.19.0/npm 11.17.0, TeX Live 2025 with the required packages, dvisvgm 3.6, and Poppler. Locked Linux dependencies were installed in this checkout. The native Windows MiKTeX installation was not changed.

`Start draft preview.cmd` and `Stop draft preview.cmd` run the live authoring server for this same Windows folder through WSL, on `http://127.0.0.1:4323/blog/`. Polling detects Windows saves. The helpers reuse the correct server before touching generated files and validate process identity before shutdown. Logs and runtime configuration are ignored under `work/`. The older shortcut in Generic testing now forwards to this live preview.

Verification: 28 unit/content/native-diagram tests passed, with the intentionally optional frozen migration test skipped. A newly created temporary draft rendered with KaTeX and real TikZ-CD. A Windows save plus a local macro change updated the article and changed its generated diagram within 2.4 seconds using the same running server. Start reuse, deleting the temporary draft, and Stop were verified. Both the complete draft build and production build passed preservation checks for 18 records and all 19 canonical assets, including 17 PDFs. The temporary test draft was removed.

Daily workflow: work on `codex/blog-drafts` in the original Windows folder, create a draft with `npm.cmd run new:post -- my-post --title "My post"`, edit its `src/content/posts/my-post/index.md`, and use the Start shortcut. Stop before branch switches or separate builds. Detailed Windows instructions are at the beginning of [authoring.md](authoring.md). The setup is retained on `codex/local-authoring-setup`; the writing branch starts from the same setup commit. The user authorized committing and pushing this setup and preparing the authoring branch. Only `master` publishes the website.

Final setup review: JavaScript and PowerShell helper syntax checks and `git diff --check` passed. Both local previews were stopped at the user's request. Next action: start the draft preview when ready to write; no setup or deployment action is needed.

## Publication preparation — 2026-10-16

The user approved the reviewed website and requested publication. The reviewed homepage, disabled resume controls, blog invitation, and portfolio categories below are included in this release. A fresh GitHub inspection confirmed the existing live site at `2023f42de108f45f50807016494402ad7212fd35`, legacy Pages `master:/`, with the `github-pages` environment already restricted to the `master` branch.

`.github/workflows/publish.yml` now defines publication only after a push to `master`: it runs unit/content and first-post integration checks, builds production and the separate draft specimen, checks canonical asset preservation, and runs all supported browser checks. Only `dist/` is packaged for deployment. Both specimen posts remain drafts. See [deployment.md](deployment.md) for publication and rollback.

The reviewed local production output passed current-source preservation; all 19 canonical assets also match the original hashes. Release completion still requires hosted checks for the final commit, switching Pages to Actions, merging the approved branch, and verifying the actual live deployment. The local `work/` directory retains release configuration and rollback evidence. The records below describe earlier stages and are historical, not the current release status.

## Local review update — 2026-10-16

The development branch was subsequently pushed with user authorization. Commit `99fc7c1` fixes CI preview-server startup; [the hosted validation run](https://github.com/naahiv/naahiv.github.io/actions/runs/38962894742) passed all 54 browser checks. The original Cloud implementation record below predates that push. Production remains unchanged.

Current local review changes remove the homepage subject eyebrow, portrait caption, and the second introductory sentence. The affiliation increases from 12px to 13px; the introductory paragraph decreases from 25px to 24px on desktop and from 22px to 21px at the narrower breakpoints. These changes are uncommitted for user review.

Further requested review edits make every resume control gray and disabled while retaining `/resume.pdf` unchanged. `src/components/ResumeLink.astro` centralizes the controls; set `resumeAvailable` to true after replacing the PDF. Visible labels use "Resume" without accents. The blog invitation now reads "Notes and ideas." Portfolio kinds/categories put both Parts 1 and 2 under Projects and Obvious Facts in Algebraic Topology under Notes. Frozen migration evidence remains unchanged; these are intentional subsequent metadata changes.

The local production build and current-source asset preservation check succeed. The freshly generated homepage, papers page, footer, and shared stylesheet were applied to the existing `dist-preview/` using ignored `work/refresh-reviewed-pages.mjs`, without removing either draft article or its math/diagram assets. This targeted local preview refresh avoids the previously observed native Windows TeX issue; it is not a fresh full draft build. The existing browser assertion was updated for disabled resume controls plus direct PDF availability. Future article changes still require the supported Linux/Cloud diagram build. The local preview runs at `http://localhost:4321/`.

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
