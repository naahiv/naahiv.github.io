# Validation, publication, and rollback

The user approved the reviewed website for publication on 16 October 2026. The first release replaces the legacy root HTML site with the production Astro build at the same address, https://naahiv.github.io/.

## Publication configuration

Set **Settings → Pages → Build and deployment → Source: GitHub Actions**. Keep the `github-pages` environment restricted to the `master` branch; this restriction was verified before release. The previous Pages setting was **Deploy from a branch → master → /(root)**.

`.github/workflows/publish.yml` runs only for pushes to `master`. Its build job installs Node 24.19.0, locked npm dependencies, and the same native TeX/PDF toolchain as validation. Unit/content checks, the first-post integration test, production and draft builds, asset preservation, and Chromium/Firefox/WebKit checks must all pass. The production build explicitly disables drafts. Only **`dist/`** is uploaded with `actions/upload-pages-artifact`; **never deploy `dist-preview/`**.

The deployment job depends on the successful build, receives only `pages: write` and `id-token: write`, and uses the protected `github-pages` environment. Feature-branch pushes and pull requests run `.github/workflows/validate.yml` without publication permissions. There is no unrestricted manual deployment trigger.

For later changes, work on a development branch, inspect the preview, obtain publication approval, and merge into `master` after validation passes. That merge triggers publication automatically. Do not change Pages back to branch-based deployment for ordinary content updates. The example posts remain unpublished drafts, so the production blog starts with an empty state until a real post is approved.

## Local and hosted verification

```sh
npm ci
npm test
npm run test:release
npm run build
node scripts/verify-preservation.mjs
npm run build:preview
node scripts/verify-preservation.mjs --dir=dist-preview
npx --no-install playwright install --with-deps chromium firefox webkit
npm run test:browser
```

Native TeX and dvisvgm must be installed; see [diagrams.md](diagrams.md). Full native diagram builds are verified on Linux/Cloud. Windows can review saved output; use the documented Linux environment for fresh diagram builds. Stop manually started static servers before a CI-mode browser run.

Preservation checks compare generated assets with the current canonical source files. `docs/baseline.json` is frozen migration evidence: do not edit it to reflect later approved changes. The optional `--baseline` comparison also freezes metadata, so it is not a release gate after the approved Projects/Notes reclassification. The first release independently verifies that all original PDF, portrait, and macro bytes are unchanged.

After GitHub reports successful deployment, inspect the actual live homepage, portfolio filters, legacy fragments, blog and archive, direct nested loads, and 404 behavior. Verify every root PDF URL/hash plus the portrait and macro asset. Confirm specimen routes return 404 and feeds/search contain no draft entries. A build or artifact upload alone does not establish that publication succeeded.

## First-release recovery point

Immediately before publication, remote `master` and the latest successful legacy Pages build both referenced **`2023f42de108f45f50807016494402ad7212fd35`**. Pages was `legacy`, source `master:/`, HTTPS enabled, without a custom domain. The local release checkout retains the captured configuration in `work/pages-before-release.json` and a public-site snapshot/hash manifest under `work/rollback-before-expansion/`. The source commit and frozen canonical hashes remain in Git history and `docs/baseline.json`.

If a release fails before deployment, the previous Pages deployment should remain served; inspect its status before changing anything. For an authorized rollback, preserve failure logs and revert the publication merge with `git revert` (using the correct mainline for a merge commit). Do not force-reset `master` or overwrite later work. Verify the restored source against the recovery commit, remove the new publication workflow as part of the revert, and restore **Deploy from a branch → master → /(root)**. Wait for deployment and verify live pages and hashes.

Alternatively, an explicitly approved recovery can deploy the retained, verified static snapshot through the master-restricted Actions workflow. Restoring the legacy site removes newly introduced blog routes. Record the actual live result before declaring recovery complete.
