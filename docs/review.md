# Review: mathematics portfolio and blog

This branch adds a complete static mathematics blog while preserving the academic portfolio. It uses Astro, Markdown, build-time KaTeX/MathML, semantic theorem/proof blocks and cross-references, and genuinely compiled TikZ-CD. It includes post/topic/archive routes, prose search, RSS, metadata, draft isolation, a starter command, and a tested authoring guide.

All 18 portfolio entries retain their content and intentional order. All 17 original PDF URLs and bytes, the portrait, and the public macro file are preserved. Notes/surveys filtering and the contact link are repaired. The production blog is intentionally empty until real posts are approved; the two substantial review specimens remain unpublished drafts.

## Start the review

From the checkout, with the documented Node/TeX tools available:

```sh
npm ci
npm run build:preview
node scripts/serve.mjs dist-preview 4321
```

Open `http://localhost:4321` on the machine running the server. For a remote Cloud workspace, use the product's port-forwarding feature if available; a loopback address on another machine is not a public preview URL. No public staging site was created.

Visit `/papers/`, `/blog/`, `/blog/mathematical-writing-specimen/`, and `/blog/a-small-pullback/`. Narrow the viewport to 390 or 320 pixels and inspect the long expression, proof, native diagrams, and contents disclosure. `npm run build` followed by `node scripts/serve.mjs dist 4322` shows the production empty state and excludes drafts.

The prebuilt review archive in `work/delivery/preview.zip` can be extracted without installing Astro or TeX. Run `node serve.mjs preview 4321` inside the extracted folder. It is review output containing draft specimens and must not be deployed as production.

## Review evidence and guides

- [Verification and limits](verification.md)
- [Browser/visual results](browser-review.md)
- [Screenshot gallery](evidence/screenshots.html)
- [Authoring guide](authoring.md) and [complete starter](../templates/post.md)
- [Math engine and compatibility decision](math-rendering.md)
- [Native TikZ-CD compiler](diagrams.md)
- [Preservation and PDF-publisher contract](migration.md)
- [Architecture](architecture.md)
- [Production transition and rollback](deployment.md)
- [Exact changed paths](changed-paths.txt)
- [Durable progress/continuation record](progress.md)

Historical logs and measurements are in `docs/evidence/`. The full browser report, traces, additional screenshots, and typography/engine comparisons are under ignored `work/`.

## Publication boundary

The implementation stays on `codex/math-blog-revamp`. It is committed locally for review, with no push, merge, live deployment, or Pages-setting change. The current live source remains legacy `master:/` at `2023f42de108f45f50807016494402ad7212fd35`.

The proposed eventual release switches Pages to GitHub Actions and deploys only the approved production branch's `dist/` artifact. That change is documented, not enabled. Validation CI has no deployment capability. Publication and any remote branch push remain separate actions.
