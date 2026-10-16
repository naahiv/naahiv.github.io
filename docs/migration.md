# Portfolio and asset migration

The migration baseline is commit `2023f42de108f45f50807016494402ad7212fd35`, inspected on 16 October 2026. `docs/baseline.json` is a frozen audit artifact: it records the original `script.js` SHA-256, every original portfolio field in source order, and the SHA-256 and length of each preserved public asset. It is not a second live metadata file and must not be edited during normal publishing.

## Authoritative files

- `src/data/portfolio.json` is the only live portfolio metadata. Array order is display order, including after search/filtering. Its 18 migrated records preserve titles, years, original `kind`, statuses, positive page counts, descriptions (including original spelling), optional venue, link labels, URLs, external flags, and link order.
- The only added field is `category`: original `note`, `notes`, and `survey` values normalize to `note`; `paper` and `project` retain their values. The Notes & surveys filter therefore includes all 14 relevant records instead of only seven.
- The 17 root PDFs remain the canonical tracked files. The portrait and `quiver-macros.tex` also remain at their original root paths. Generated copies are ignored and must never be committed.
- `src/data/legacy-assets.json` explicitly lists these 19 public assets. `scripts/stage-assets.mjs` copies exactly those files into `.generated/public`, Astro's public directory. It does not copy source, tests, audit documents, or local files. It does not erase assets produced by the diagram/content compiler.

The first record remains **Part 2: Stable ∞-categories in Algebraic Geometry**, 120 pages, in progress, with an intentionally empty `links` array. The second remains **Part 1: Derived Categories in Algebraic Geometry**, 396 pages, in progress, with **PDF** followed by **Book PDF** in one record. The external-only monoidal-categories and quantum-computing records retain their scholarly URLs and publication details.

Local metadata hrefs retain their original filenames. The renderer turns them into root-relative links so they also work from nested routes. The required home fragments are `/#top`, `/#work`, `/#about`, and the repaired `/#contact`. The active email is `naahiv@caltech.edu`.

## Verification commands

From the repository root:

```sh
node scripts/stage-assets.mjs
node scripts/verify-preservation.mjs --dir=.generated/public
npm run build
node scripts/verify-preservation.mjs
```

The first comparison verifies development public assets. The second checks production `dist` against the **current canonical source files**. Missing files, changed bytes, invalid metadata, missing linked assets, and unsafe manifest paths fail with the relevant filename or record. Both verifiers are cross-platform Node commands.

For the redesign migration certificate only, append `--baseline`:

```sh
node scripts/verify-preservation.mjs --baseline
```

This additionally compares every original metadata field and its ordering, plus every canonical asset hash, with the frozen baseline. Do not run this historical comparison as a permanent publication gate after an authorized PDF or metadata change.

Run the ongoing preservation suite with:

```sh
node --test tests/preservation.test.mjs
```

The frozen-baseline unit case is intentionally opt-in. Run it on Linux/macOS with `MIGRATION_BASELINE=1 node --test tests/preservation.test.mjs`, or on PowerShell with `$env:MIGRATION_BASELINE='1'; node --test tests/preservation.test.mjs; Remove-Item Env:MIGRATION_BASELINE`.

## Replacing the derived-categories PDF

The local publisher's contract remains two source changes:

1. Verify the intended repository origin is `https://github.com/naahiv/naahiv.github.io.git` and inspect the working tree so unrelated work is preserved.
2. Locate the unique tracked `derived-cats-in-ag.pdf` by its exact leaf filename. The canonical file is still at the repository root. Use the already compiled TeX project's `main/main.pdf`; do not recompile or alter its TeX during this refresh.
3. Copy that compiled PDF over the root canonical file, keeping the filename and URL unchanged. Compare source and target SHA-256 hashes. For example, `sha256sum` on Linux or `Get-FileHash -Algorithm SHA256` on PowerShell provides the comparison.
4. In **`src/data/portfolio.json`**, find the unique record with a link whose href is `derived-cats-in-ag.pdf`; update only its `pages` value. Confirm the source and target PDF page counts match and are positive (`pdfinfo` reports `Pages` where available). Do not edit `docs/baseline.json`, generated files, or HTML.
5. Build, run the current-content verification above, inspect the preview, and confirm the source diff contains only `derived-cats-in-ag.pdf` and `src/data/portfolio.json`. The Book PDF changes only if separately intended.
6. Publish Git changes only under the user's separate authorization. A local build does not publish the website.

The old `script.js` renderer and `README.txt` instructions are retired after migration so a publisher cannot accidentally update obsolete live metadata. Historical Git versions and the explicitly frozen baseline remain available for audit; tooling should discover the live metadata from the documented path above.

## Recorded checks

The initial migration check passed against staged development assets: **18 records, 17 PDFs totaling 10,727,259 bytes, and 19 unchanged assets overall**. All seven preservation tests passed with the migration case enabled. The tests exercise exact metadata/order, linkless Part 2, dual-link Part 1, all 14 note-category records, missing and stale files, unsafe paths, and the explicit asset allowlist.

The PDF-refresh test runs entirely in a disposable directory. It substitutes the valid 42-page `galois-theory.pdf` for `derived-cats-in-ag.pdf`, changes only the corresponding page count, stages it, and verifies the served bytes equal the replacement source. It asserts exactly two source files changed, demonstrates current-content verification succeeds, and confirms frozen-baseline verification rejects that intentional divergence. The temporary directory is removed; no original PDF is changed. Independent `pdfinfo` inspection confirmed 396 pages for the original derived-categories PDF and 42 for the simulated replacement.

Final production-output and browser results belong in `docs/progress.md` and the final verification report, because the rest of the site is integrated after this asset audit.
