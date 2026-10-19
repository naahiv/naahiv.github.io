# Writing and maintaining the site

Posts are Markdown files in `src/content/posts/<slug>/index.md`. The folder can also hold images and other post assets. Start with the command below; no layout component needs editing. The complete example in [templates/post.md](../templates/post.md) is compiled by `tests/authoring.test.mjs`, including its native TikZ-CD diagram.

## Windows workflow in this checkout

The original Windows checkout can be edited directly while WSL Ubuntu supplies Linux Node 24.19.0, npm 11, TeX Live, and dvisvgm. No second source checkout or file-copy step is needed. Use **`codex/blog-drafts`** for everyday authoring in this folder; it includes the helpers committed on `codex/local-authoring-setup`. `master` is the published website branch.

Check the selected branch with `git branch --show-current`. If needed, stop the preview and run `git switch codex/blog-drafts` before writing. Keep unfinished posts marked `draft: true`. Commit and push selected post files on this branch to save them to GitHub; these pushes run validation but do not publish the website. Draft source pushed to this public repository is visible on GitHub even though it is excluded from the published blog.

1. In PowerShell, create a post with `npm.cmd run new:post -- my-post --title "My post"`. This starter command uses only standard Node file operations and can run directly on Windows.
2. Edit `src/content/posts/my-post/index.md` in your usual editor. Replace its instructional example and metadata, and keep `draft: true` while writing.
3. Double-click **Start draft preview.cmd** in the repository folder. It opens `http://127.0.0.1:4323/blog/`; the draft itself is at `http://127.0.0.1:4323/blog/my-post/`.
4. Keep editing the same Markdown file. Windows saves are detected by polling; wait for compilation, then refresh the browser. Macros and genuine TikZ-CD diagrams rebuild too. No commit or push is needed to see an edit.
5. Double-click **Stop draft preview.cmd** when finished. Stop and restart after changing Git branches, dependencies, or the site configuration. Ordinary post edits do not require a restart.

Starting the shortcut again reuses the matching live server. The background process is hidden; diagnostics are `local-authoring.log` and `local-authoring-error.log` in the external working directory, currently `C:\Users\vihaa\Documents\Generic testing\website-work\naahiv.github.io`. The server binds only to loopback and checks the checkout identity before reuse or shutdown. Port 4323 is separate from the earlier saved static preview on port 4321 and from browser-test ports.

Keep one-off scripts, working/review notes, screenshots, and reports outside the website checkout. Actual post Markdown and website sources stay here. `node scripts/work-directory.mjs` prints the working directory used by the preview and test tools. It defaults to the sibling Generic testing workspace when available, otherwise a checkout-specific directory under the system temporary directory. `WEBSITE_WORK_DIR` can select another absolute path outside the checkout; use the path format of the runtime (Windows for PowerShell helpers, Linux for WSL commands). CI sets it to a runner temporary directory.

Double-click **Watch draft errors.cmd** to show the last 20 error-log lines and watch for new errors while writing. From PowerShell, run `& ".\Watch draft errors.cmd"`. If the preview has never run, the viewer waits for its log to appear. A failed save can leave the browser showing the last successful version; fix the reported error, save, then refresh. Old errors remain in the log, so check their timestamps. Ctrl+C or closing the viewer stops watching without stopping the preview.

This checkout's `node_modules` is installed for **Linux**. Run dependency installation and builds through WSL from a PowerShell terminal in the repository:

```powershell
wsl -d Ubuntu -- npm ci                 # only when dependencies change
wsl -d Ubuntu -- npm run build:preview  # complete static output including drafts
wsl -d Ubuntu -- npm run verify         # production build and asset checks
wsl -d Ubuntu -- npm test
```

Stop the live preview before these build commands because preparation clears generated files shared by the development server. Use the Start shortcut for everyday drafting. Do not replace Linux dependencies with Windows `npm ci`, or use Windows `npm run dev` with this dependency installation. Neither the shortcuts nor local builds publish the website.

## Set up the tools

Use Node **24.19.0** and npm 11, then run `npm ci` from the repository root. The lockfile pins JavaScript dependencies. Native diagrams also need `latex`, `kpsewhich`, and `dvisvgm` on `PATH`, with the TeX Live packages listed in [diagrams.md](diagrams.md).

On Debian/Ubuntu, including WSL2 Ubuntu:

```sh
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-latex-extra texlive-pictures texlive-fonts-recommended texlive-science dvisvgm util-linux
npm ci
latex --version
dvisvgm --version
```

On Windows, **WSL2 Ubuntu is the supported route**: install Node 24.19.0 and the tools above inside WSL. A checkout in the WSL filesystem gives the best performance. The prepared Windows checkout instead uses the shortcuts above with polling, so Windows editors can modify the same files reliably. The browser can open the local server from Windows.

The Node commands use cross-platform APIs and do not require shell-specific environment-variable syntax. A native Windows setup needs Node 24.19.0 and TeX Live with its executable directory (usually `C:\texlive\2026\bin\windows`) on `PATH`; a new PowerShell terminal must resolve `node`, `npm`, `latex`, `kpsewhich`, and `dvisvgm`. Native Windows TeX compilation has **not** been verified. Use WSL2 if you need the tested Linux behavior and process resource limits; do not assume an existing LaTeX editor installation includes a working `dvisvgm`.

In this implementation's Cloud workspace only, start each shell with:

```sh
source /workspace/portfolio-toolchain/activate.sh
```

This activates session-provided tools. It is not needed on an ordinary installation and is not a portable dependency of the repository.

## Create and preview a post

```sh
npm run new:post -- a-first-observation --title "A first observation" --date 2026-10-16
npm run dev
```

Open `http://localhost:4321/blog/a-first-observation/`. Development includes drafts. The command refuses an existing post directory, validates the slug and date, and creates `draft: true`. Omitting `--date` uses the local calendar date. `--dir /path/to/posts` selects a separate destination, useful for experiments and tests. Run `npm run new:post -- --help` for usage.

Replace the instructional mathematical example, title, summary, topics, and date with your own content. For a short informal post, delete the formal blocks and diagram; ordinary paragraphs and inline formulas are sufficient.

Use the browser's responsive mode at 390 and 320 CSS pixels. Inspect every display and diagram, including arrowheads, numbers, long labels, and local scrolling. The development server watches post files, colocated assets, and shared macros. Adding, editing, and deleting a draft updates the served content without restarting the server; refresh the browser after the rebuild finishes. For a complete static preview, run:

```sh
npm run build:preview
node scripts/serve.mjs dist-preview 4321
```

This writes a separate `dist-preview/` containing drafts. Open the same URL. Stop the server with Ctrl+C before starting another server on port 4321. A diagram's source and textual description remain available in the article. Wide formulas and diagrams scroll locally; use meaningful `aligned` line breaks when possible.

**Drafts in this public repository are not private.** The flag excludes them from the production site, search, feeds, tags, sitemap, and copied post assets. Anyone with repository access can still read committed source and Git history. Keep confidential work outside the public repository. Preview output also contains draft content; do not publish it.

## Post metadata

```yaml
---
title: 'A first observation'
slug: a-first-observation
date: '2026-10-16'
updated: '2026-10-17'
summary: 'A short plain-language summary for the index, search, and RSS.'
tags: [algebra, category-theory]
draft: true
series:
  name: 'Small observations'
  order: 1
macros: |
  \newcommand{\Ab}{\mathrm{Ab}}
---
```

`title`, `slug`, `date`, and `summary` are required. `updated`, `series`, and `macros` are optional; `tags` defaults to an empty list and `draft` defaults to true. Always write `draft` explicitly. Slugs and tags use lowercase letters, digits, and single hyphens. The post slugs `archive` and `tags` are reserved for blog navigation. Use real ISO calendar dates. Series order is a positive integer and gives the article's position in that named series.

The slug determines `/blog/a-first-observation/`; changing the title or date does not change the URL. Preserve a published slug and stable labels when revising. Unknown frontmatter fields fail validation. The special `specimen: true` flag is for development fixtures and requires `draft: true`; it is not necessary for your own drafts.

Titles can contain `$...$`, but clear prose titles and summaries produce the best search snippets. Search covers text and metadata, not semantic formulas. Use ordinary links and prose for citations; automatic BibTeX/citation-key processing is not implemented.

## Mathematics and macros

Write inline mathematics as `$\Hom(\ZZ,A)$` and display mathematics on its own lines:

```tex
$$
\begin{aligned}
u_a(n+m) &= (n+m)a \\
         &= u_a(n)+u_a(m).
\end{aligned}
\label{eq:additivity}
$$
```

The label opts this display into equation numbering. Use one label per display; split separately numbered expressions into separate displays. An unlabeled display remains unnumbered. Math works in headings, lists, footnotes, and theorem titles as well as paragraphs.

Shared notation lives in `src/data/math-macros.tex`. Per-post definitions go in the frontmatter `macros: |` block. Both are passed to the article renderer and native diagram compiler. They support these forms:

```tex
\newcommand{\Ab}{\mathrm{Ab}}
\newcommand{\pairing}[2]{\langle #1,#2\rangle}
\renewcommand{\cF}{\mathcal{E}}
\DeclareMathOperator{\End}{End}
```

Use `\renewcommand` only for a deliberate override of an existing command. Macro state starts fresh for each post. The supported shared profile allows 0–9 explicit arguments and `\DeclareMathOperator` (including its starred form), but no optional argument defaults, `\def`, file input, or package-loading directives. Use an explicit argument instead of a macro with a default. Define notation in these macro sources, not inside individual formulas.

Ordinary math uses build-time **KaTeX**, with HTML and MathML. This is not a full TeX installation: selected commands from common packages work, but package parity is not promised. Unknown commands fail the build. Consult [math-rendering.md](math-rendering.md) before porting unfamiliar notation. The public `/quiver-macros.tex` is preserved unchanged; it is not automatically loaded because it includes native package and arrow definitions.

## Theorems, proofs, and stable references

````markdown
## Evaluation {#evaluation}

The forward reference :ref[lem:evaluation] resolves after all labels are collected.

:::lemma[Evaluation]{#lem:evaluation}
For an abelian group $A$, evaluation at $1$ identifies $\Hom(\ZZ,A)$ with $A$.
:::

:::proof
The inverse sends $a$ to the map $n\mapsto na$.
:::

:::remark[A choice of notation]{#notation unnumbered}
This block has a name and stable label, but does not advance the counter.
:::

See :ref[evaluation], :ref[lem:evaluation], and :ref[eq:additivity].
````

Available block names are `theorem`, `lemma`, `proposition`, `corollary`, `definition`, `remark`, `example`, `question`, and `proof`. Theorem-like blocks share one counter per article. Add `unnumbered` to opt out. Proofs are always unnumbered and receive an end-of-proof mark automatically. Titles in square brackets are optional. The block's prose stays Markdown; do not put an entire statement inside math delimiters.

Any of these environments can be made collapsible:

```markdown
:::remark[Morphisms between morphisms]{#rem:morphisms collapsible}
An optional clarification, with ordinary Markdown, math, and diagrams.
:::
```

`collapsible` starts open. Use `collapsed` instead to start closed; it implies collapsibility. If both flags are present, the block starts closed. Readers click the label/title line or focus it and press Enter or Space to toggle it. A closed block shows only its label, optional title, permalink when labelled, and a disclosure arrow. Numbering and `unnumbered` work as usual. Titles still support inline Markdown and math, and the full content is compiled and validated even when initially hidden.

The disclosure itself works without JavaScript. With the reading script enabled, following a fragment link opens the target block and any enclosing collapsed blocks; printing temporarily opens all collapsible environments and restores their previous state afterward. Reloading returns to the author's chosen initial state, unless a fragment link requires the block to open.

Use semantic labels such as `lem:evaluation`, not labels based on the current number. Labels begin with a letter and may contain letters, digits, `_`, `.`, `:`, or `-`. Explicit heading labels use `{#evaluation}`. Otherwise the heading receives an automatic label derived from its text; use an explicit label when readers will link to it.

| Target | Syntax |
| --- | --- |
| A result, section, equation, or diagram in this post | `:ref[lem:evaluation]` |
| A label in another included post | `:ref[other-post#lem:evaluation]` |
| Another included post by title | `:post[other-post]` |
| A numbered equation from within math | `$\eqref{eq:additivity}$` |
| A result/equation from within math | `$\ref{lem:evaluation}$` |

References become ordinary links and work without JavaScript. Forward references are supported. Missing targets, duplicate labels, and references from published content to an excluded draft fail the build. Renumbering does not change label URLs. `\label`, `\ref`, and `\eqref` are supported inside math; use the `:ref[...]` directive in ordinary prose.

## Native TikZ-CD diagrams

````markdown
```tikzcd {#diag:evaluation caption="Evaluation at one." description="Evaluation at 1 maps Hom from the integers to A isomorphically onto the abelian group A."}
\begin{tikzcd}[column sep=large]
  \Hom(\ZZ,A) \arrow[r, "\mathrm{ev}_1", "\cong"'] & A
\end{tikzcd}
```

See :ref[diag:evaluation].
````

A `tikzcd` fence contains the complete environment and a stable `#id`. **Both `caption` and `description` are optional and independent.** For a diagram without either, use an opening fence such as `` ```tikzcd {#diag:evaluation} ``. Omitted or empty fields produce no caption or description text; a description is not substituted for a missing caption. Captions support inline Markdown/math. Descriptions are plain text and, when supplied, also become SVG accessibility descriptions. Native TeX automatically produces a transparent SVG, while the original source remains in the Markdown. Shared and per-post commands are available.

Quiver exports using `curve={height=...}`, `between={...}{...}`, and arrows between arrows are supported automatically by the bundled Quiver 1.6 package. Paste the exported diagram into the fence; its surrounding `\[...\]` is also accepted. No package declaration is needed in the post. Ordinary diagram edits update the running preview; changes to the compiler or its bundled package require stopping and starting it.

This is real TeX Live TikZ-CD. Hooks, two-headed, equality, dashed, bent, diagonal, and parallel arrows are tested. Do not replace an unsupported special arrow with a different mathematical arrow. The native package profile, installation, cache behavior, isolation, and extension procedure are documented in [diagrams.md](diagrams.md). A TeX error stops the build with the source location and compiler output. Generated SVGs and `.cache/` are disposable; do not edit or commit them as the source.

## Footnotes, citations, and assets

```markdown
This is natural in the group.[^natural]

[^natural]: Each homomorphism gives a commutative square.

## References {#references}

See [the Stacks project](https://stacks.math.columbia.edu/).

![An authored explanation of the figure](./figure.svg)
```

Keep local assets inside the post's own directory. Only referenced assets are copied into `/post-assets/<slug>/`; missing files fail validation. Supported local extensions are `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`, `.pdf`, and `.tex`. Use ordinary external URLs for scholarly references and root-relative links such as `/derived-cats-in-ag.pdf` for existing portfolio PDFs. Do not duplicate a root PDF inside a post.

## Validate a publication candidate

After replacing all starter text and reviewing the mathematics, set `draft: false`. This changes build inclusion only; it does not deploy the site. Then run:

```sh
npm test
npm run verify
node scripts/serve.mjs dist 4321
```

`verify` builds production output and compares the served-asset files with their current canonical sources. Inspect the production article and its direct fragment URLs, index, tags, search, and RSS. For the complete browser suite, install Playwright's supported browser dependencies with `npx playwright install --with-deps` on a normal Linux/WSL machine. Stop the server above with Ctrl+C, then run:

```sh
npm run build:preview
npm run build
npm run test:browser
```

The suite starts the draft preview on port 4321 and production preview on port 4322. Leave both ports free; an existing production server on 4321 would serve the wrong site to draft tests. See [browser-review.md](browser-review.md) for the suite and known manual limits.

Work on a `codex/` development branch. Building, previewing, and changing draft status do not authorize merging into `master`, changing GitHub Pages settings, or deploying. An approved merge into `master` triggers publication automatically. `dist/` is production build output; `dist-preview/` contains development drafts. Neither is canonical source.

## Replace a portfolio PDF

Root PDFs remain the sole canonical copies. Portfolio metadata has moved from the old `script.js` into **`src/data/portfolio.json`**, the only editable portfolio metadata source. An ordinary refresh changes exactly the target PDF and this JSON file.

1. Use the already-compiled source PDF; do not rebuild or alter the separate TeX project as part of publishing it. Verify the repository origin and find the unique tracked root filename, for example `git ls-files derived-cats-in-ag.pdf`.
2. Replace that root file with the compiled PDF, preserving its exact filename. Check source/target SHA-256 equality and obtain the PDF's positive page count with your PDF tool (`pdfinfo` is available through Poppler).
3. In `src/data/portfolio.json`, locate the unique record whose `links` contains the target filename, and update its `pages`. Keep Part 1's two PDF links together and retain the entire array's chosen order. Part 2 links to `stable-infty-cats-in-ag.pdf`.
4. Run `npm run verify`, serve `dist/`, and open the listing and `/derived-cats-in-ag.pdf`. Confirm the served PDF matches the canonical root file.
5. Review `git diff --name-only`; a normal refresh should touch only that PDF and `src/data/portfolio.json`. Obtain separate authorization for Git publication or deployment as appropriate.

For a first PDF release, add its root filename to `src/data/legacy-assets.json` as well as the appropriate portfolio record's `links`, so development and production builds serve it. Future refreshes keep that filename stable.

Do not update `docs/baseline.json` to make an ordinary refresh pass: those frozen hashes record this migration. Ongoing verification compares current canonical files to build output. The test suite simulates the two-file refresh in a temporary directory without touching original PDFs. [migration.md](migration.md) records the preservation checks and asset allowlist.
