# Validation, publication, and rollback

Production is unchanged. Work is on `codex/math-blog-revamp`; no merge to master, production deployment, or Pages-setting change is part of this implementation.

## Observed production configuration

The read-only GitHub Pages inspection on 16 October 2026 reported:

- Repository: `naahiv/naahiv.github.io`.
- Pages build type: `legacy`.
- Source: branch `master`, folder `/`.
- Site: `https://naahiv.github.io/`, HTTPS enabled.
- Revalidated master/baseline commit: `2023f42de108f45f50807016494402ad7212fd35`.

This is a user site at the domain root. Astro's `site` is `https://naahiv.github.io`, with no `/naahiv.github.io/` base path and with trailing-slash post routes. Do not replace the observed configuration based on assumptions about the repository layout. Re-read the current Pages setting immediately before any later authorized release, because it can change independently of this branch.

## Validation only

`.github/workflows/validate.yml` runs on pushes and pull requests with `contents: read` and without stored checkout credentials. It installs Node 24.19.0, locked npm dependencies, TeX Live packages, dvisvgm, and PDF tools on Ubuntu 24.04. It clears the diagram cache, runs unit/content checks, builds production, verifies current canonical assets, clears the cache again, and builds the full draft specimen from TeX source.

The Playwright version and browser revisions come from the npm lockfile. CI installs Chromium, Firefox, and WebKit with their operating-system dependencies. Playwright starts local static servers for `dist-preview` on port 4321 and `dist` on port 4322, then runs the browser suite. Screenshots, traces/reports, print output, and both static builds are uploaded as review artifacts with 14-day retention. Artifact upload does not publish GitHub Pages. This workflow contains no Pages deployment/environment, no write permission, and no manual trigger that can deploy a feature branch.

The historical `--baseline` preservation check is intentionally not a permanent CI gate: future authorized PDF updates must compare output against current canonical source bytes. For this redesign review, run `node scripts/verify-preservation.mjs --baseline` after a production build to certify the unchanged original assets and metadata.

## Local review

```sh
npm ci
npm test
npm run build
node scripts/verify-preservation.mjs
npm run build:preview
npx --no-install playwright install --with-deps chromium firefox webkit
npm run test:browser
```

Native TeX and dvisvgm must already be installed; see `docs/diagrams.md`. `--with-deps` is intended for supported Linux environments; the Windows guide uses WSL for native compilation. Run `node scripts/serve.mjs dist-preview 4321` for an interactive draft review and `node scripts/serve.mjs dist 4322` for production. Stop manually started servers before a CI-mode browser run, whose configuration deliberately refuses to reuse them.

Only the draft preview includes the explicitly labeled specimen articles. The production build's empty blog is intentional until the author approves real posts. Never select `dist-preview` as a release artifact.

## Proposed publication after separate approval

The recommended future change is **Settings → Pages → Build and deployment → Source: GitHub Actions**, replacing the observed **Deploy from a branch → master → /(root)**. This exact production change requires explicit authorization, together with any publication merge/push and deployment. Do not enable it merely to obtain a review URL.

Before asking for that approval, finish the reviewed source and commit/diff, pass the production and draft checks, inspect desktop/mobile screenshots, record the current Pages configuration and currently deployed SHA, and retain a copy/hash manifest of the last working output. The source PDF migration check must pass. Name the exact reviewed commit to publish; revalidate if it changes.

After approval, prepare a separate production workflow with this boundary. The following is documentation, **not an enabled workflow**:

```yaml
name: Publish approved website
on:
  push:
    branches: [master]
permissions:
  contents: read
concurrency:
  group: github-pages-production
  cancel-in-progress: false
jobs:
  build:
    if: github.ref == 'refs/heads/master' && github.event_name == 'push'
    runs-on: ubuntu-24.04
    steps:
      # Check out the approved master revision with persist-credentials: false.
      # Install the same pinned Node/npm and native packages as validate.yml.
      # npm ci; npm test; npm run build
      # node scripts/verify-preservation.mjs
      # Upload ONLY dist via actions/upload-pages-artifact.
  deploy:
    needs: build
    if: github.ref == 'refs/heads/master' && github.event_name == 'push'
    runs-on: ubuntu-24.04
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy approved production artifact
        id: deployment
        uses: actions/deploy-pages@v4
```

Complete and review the build steps using the already tested validation toolchain; the excerpt is not a copy-and-run release file. Restrict the `github-pages` environment to `master` in GitHub's deployment branch rules. Do not add a feature-branch or unrestricted `workflow_dispatch` path. Prefer a protected master branch and required validation checks. The build job has no Pages credentials, and only the branch-restricted deploy job receives its minimal deployment permissions.

Coordinate the approved merge with the Pages-source change so the new source is served through Actions, not Jekyll. Keep the last deployment available until the new Actions job completes. After deployment, inspect the actual live site, direct nested post loads/refreshes, useful home fragments, 404 behavior, all 17 root PDF URLs and their hashes, portrait, and macro asset. Review the live production blog for draft exclusions. A successful build or artifact upload alone is not proof of a completed live deployment.

## Rollback

The exact pre-expansion source reference is `2023f42de108f45f50807016494402ad7212fd35`; its public asset hashes and metadata are retained in `docs/baseline.json`. The pre-expansion Pages source is **legacy `master:/`**. Record any newer working production reference at release time rather than assuming this baseline remains the latest safe point.

If the new publication fails, first preserve its logs and the current configuration. Under explicit rollback authorization, revert the publication merge/change with `git revert` so master again contains the last working root `index.html`, `styles.css`, `script.js`, and canonical assets. Verify the restored tree against the recorded working reference before pushing. Do not force-reset master or overwrite unrelated later work. Remove/disable the new deployment workflow as part of that reviewed revert, then restore **Settings → Pages → Deploy from a branch → master → /(root)**. Wait for the legacy deployment and recheck the home page, portfolio order, contact/résumé, and PDF hashes.

If retaining Actions instead is preferred, deploy the previously retained, verified static artifact through the same authorized master-restricted production process; changing to an unreviewed feature branch is not a rollback. Restoring the old website means newly introduced blog URLs may no longer exist. Confirm which rollback path the user authorized and inspect the resulting live site before declaring recovery complete.
