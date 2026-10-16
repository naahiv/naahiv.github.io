# Vihaan Dheer · mathematics

Static Astro portfolio and Markdown mathematics blog. The canonical PDFs stay at the repository root; portfolio metadata lives in **src/data/portfolio.json**, in intentional display order.

## Run locally

Use Node **24.19.0**, npm, TeX Live (`latex`, standalone, tikz-cd, amsmath, amssymb, mathtools, mathrsfs), and `dvisvgm`. In the prepared cloud workspace first run `source /workspace/portfolio-toolchain/activate.sh`.

```sh
npm ci
npm run dev                       # local draft preview, port 4321
npm run build                     # production, drafts excluded → dist/
npm run build:preview             # review specimens/drafts → dist-preview/
node scripts/serve.mjs dist-preview 4321
```

Read [the authoring guide](docs/authoring.md) for Windows/WSL setup and actual tested syntax. `npm run new:post -- descriptive-slug` creates a complete starter. Confidential drafts must stay outside this public repository.

## Verify

```sh
npm test
npm run test:release
npm run build
node scripts/verify-preservation.mjs
npm run build:preview
npm run test:browser
```

The browser suite starts production and preview servers automatically and tests Chromium, Firefox, and WebKit; install them with `npx playwright install --with-deps` on a fresh Linux machine. A frozen migration audit additionally uses `node scripts/verify-preservation.mjs --baseline`; ordinary PDF publishing uses current-source comparisons instead.

- [Progress and continuation](docs/progress.md)
- [Authoring](docs/authoring.md) · [Math compatibility](docs/math-rendering.md) · [Native diagrams](docs/diagrams.md)
- [Migration/publisher contract](docs/migration.md) · [Architecture](docs/architecture.md)
- [Verification](docs/verification.md) · [Deployment and rollback](docs/deployment.md)

The development branch is `codex/math-blog-revamp`. Validation CI does not deploy. Production Pages settings and `master` are unchanged.
