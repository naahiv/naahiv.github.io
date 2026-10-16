# Vihaan Dheer · mathematics

Static Astro portfolio and Markdown mathematics blog. The canonical PDFs stay at the repository root; portfolio metadata lives in **src/data/portfolio.json**, in intentional display order.

## Run locally

On the prepared Windows computer, use branch **`codex/blog-drafts`** and double-click **Start draft preview.cmd** in this folder. It runs the live editor preview through WSL Ubuntu at **http://127.0.0.1:4323/blog/**. Edit Markdown in this same Windows checkout, save, and refresh. **Stop draft preview.cmd** stops this checkout's server. See [the Windows workflow](docs/authoring.md#windows-workflow-in-this-checkout).

Use Node **24.19.0**, npm, TeX Live (`latex`, standalone, tikz-cd, amsmath, amssymb, mathtools, mathrsfs), and `dvisvgm`. In the prepared cloud workspace first run `source /workspace/portfolio-toolchain/activate.sh`.

Run the following commands in Linux/WSL. The prepared Windows checkout uses Linux dependencies; use the shortcuts above for daily previewing and the Windows workflow for PowerShell commands.

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

Develop on a `codex/` branch. Validation CI does not deploy; approved merges into `master` trigger the checked GitHub Pages publication workflow. The redesigned site was published on 16 October 2026.
