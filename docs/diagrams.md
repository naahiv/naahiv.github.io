# Native TikZ-CD diagrams

Diagrams are compiled from their original TeX during the build. They are genuine TikZ-CD, not KaTeX's simpler `CD` environment or manually exported drawings. Put one picture in each diagram block and supply a stable label. Captions and descriptions are optional; either can be supplied independently. See [authoring.md](authoring.md) for the complete post syntax and [math-rendering.md](math-rendering.md) for ordinary equations.

````markdown
```tikzcd {#evaluation caption="Evaluation at one" description="Evaluation at 1 identifies homomorphisms from the integers to A with elements of A."}
\begin{tikzcd}[column sep=huge]
  \Hom_{\mathrm{Ab}}(\ZZ,A) \arrow[r, "{\mathrm{ev}_{1}}", "\cong"'] & A
\end{tikzcd}
```
````

Shared notation and the post's macro definitions are passed as the same TeX source used by article mathematics. Keep these definitions portable (`\newcommand`, deliberate `\renewcommand`, `\DeclareMathOperator`) and free of package loading. A native diagram can use the tested native package profile below; that does **not** imply that the article renderer implements entire TeX packages. The existing public `/quiver-macros.tex` remains unchanged as a scholarly asset. Its package directives, assumptions about pre-existing commands, and `old-arrows` definitions mean it is not automatically loaded into either pipeline. Port a needed definition deliberately, preserving the mathematical arrow and its source.

## Installation and commands

On Debian/Ubuntu or Windows through WSL2 Ubuntu, install the native tools:

```sh
sudo apt-get update
sudo apt-get install texlive-latex-base texlive-latex-extra texlive-pictures texlive-fonts-recommended texlive-science dvisvgm util-linux
```

Then use the repository's pinned Node/npm installation and run:

```sh
npm ci
node --test tests/diagrams.test.mjs
npm run build
```

The diagram tests create their own empty temporary cache, compile all fixtures, change a macro, and remove the cache before recompiling. No checked-in SVG or previous build is required. WSL2 runs the same Linux path as CI, including OS resource limits. Native Windows and macOS have not been verified; use WSL2 for the documented Windows authoring workflow. On this Cloud workspace, first run `source /workspace/portfolio-toolchain/activate.sh` in each terminal; this is session tool setup, not a repository dependency or a command needed on a normal TeX Live installation.

Verified Cloud tool versions on 16 October 2026:

| Tool/package | Version |
| --- | --- |
| pdfTeX / LaTeX | 3.141592653-2.6-1.40.26, TeX Live 2025/dev/Debian |
| dvisvgm | 3.4.4 |
| standalone | 1.5a (2025-02-22) |
| PGF / TikZ | 3.1.10 |
| tikz-cd | 1.0 |
| amsmath | 2.17t |
| amssymb | 3.01 |
| mathtools | 1.31 |
| mathrsfs | 1.0 |

Installed versions in CI may differ with the OS release. The build records native version output and package hashes in the cache key, so incompatible generated assets cannot be silently reused across these changes.

Quiver 1.6.0 is bundled unchanged under `src/lib/content/tex/quiver/` with its MIT license and pinned upstream revision. It supplies `curve`, `between`, and Quiver's additional arrow styles, using the system `spath3` library from `texlive-pictures`. No separate Quiver installation is needed. This is independent of the public `quiver-macros.tex` notation asset. See the [bundled package provenance](../src/lib/content/tex/quiver/README.md).

## Tested wrapper and driver

The starting `\usepackage[dvisvgm]{tikz}` suggestion in the handoff was tested and fails with this PGF version: TikZ does not accept that package option. The working wrapper selects the PGF driver explicitly **before** loading TikZ, and supplies `dvisvgm` as a document option for graphics/color packages:

```tex
\documentclass[dvisvgm,preview,multi=tikzpicture,border=5pt]{standalone}
\def\pgfsysdriver{pgfsys-dvisvgm.def}
\usepackage{tikz}
\usepackage{tikz-cd}
\usepackage{amsmath,amssymb,mathtools,mathrsfs}
\usepackage{quiver}
\usetikzlibrary{arrows.meta,decorations.markings,calc}
% Shared and post macro definitions are inserted here.
\begin{document}
% The original tikzcd environment is inserted here.
\end{document}
```

The compiler verifies that the LaTeX log actually loads `pgfsys-dvisvgm.def`, then runs:

```sh
latex -interaction=nonstopmode -halt-on-error -no-shell-escape -file-line-error diagram.tex
dvisvgm --no-fonts --bbox=preview --exact --output=diagram.svg diagram.dvi
```

The initial `--bbox=min` smoke test produced excess whitespace with nested TikZ labels. Desktop/mobile inspection caught it. The final profile uses `standalone`'s preview mode and `--bbox=preview`, so the true TeX picture bounds determine the viewport. The native preview package comes with the documented TeX Live installation and participates in the cache key.

No PDF converter or Ghostscript path is required by this tested DVI profile. A package that genuinely requires LuaLaTeX/PDF must be introduced as a separate tested profile; no such support is currently claimed.

The fixtures cover labels, long labels, superscripts, diagonal arrows, bent arrows, parallel arrows, hooks, two-headed arrows, dashed arrows, equality arrows, blackboard bold, calligraphic and script letters, fractions, and shared commands with arguments. The exact TeX lives in `tests/fixtures/diagrams/`. The article specimen also displays the same notation in surrounding equations and a diagram for visual comparison.

The `quiver-modification.tex` fixture preserves an exported diagram with curves, proportional shortening, shifted double arrows, and arrows between arrows. Its original display delimiters are retained. Tests compile it from an empty cache, check accessible sanitized output, reuse the cache, and rebuild reproducibly.

## Output and accessibility

The SVG has a transparent background. The converter emits outlined glyphs, so diagrams do not depend on an external font service, but those glyphs are not selectable or independently meaningful to a screen reader. Every diagram has the accessible title "Mathematical diagram". An optional authored description adds an SVG `<desc>` and visible explanatory text. Without one, no description is invented. The article preserves the expandable TeX source. A visible caption appears only when `caption` is supplied.

The compiler parses SVG as XML and permits only drawing elements and a fixed set of inert attributes. It rejects scripts, event handlers, foreign content, external references, document types, entities, and broken fragment references. It prefixes **all** internal IDs per diagram and updates `href`, `xlink:href`, and `url(#...)` uses. Two diagrams embedded together are tested for ID collisions and missing glyph references. Four converter units of additional padding protect arrowheads at the SVG boundary.

The wrapper uses 10pt mathematics, and the SVG's dimensions are expressed in `em` relative to that size. Labels therefore scale with article text rather than remaining at a small fixed image size. The surrounding article component supplies a keyboard-focusable local scroll region for wide diagrams; it must not force `max-width: 100%` on these SVGs, which would shrink their labels. Color is intentionally checked in the light theme; no automatic dark-mode inversion is promised.

## Cache, isolation, and extension

`src/lib/content/diagrams.mjs` exports:

```js
await compileDiagram({
  source,             // Original complete tikzcd environment.
  description,        // Optional authored text.
  id,                 // Stable semantic identifier.
  macros,             // Shared + post TeX definitions, as a string.
  sourcePath,         // Displayed in every build failure.
  cacheDir,           // Defaults to ignored .cache/tikzcd.
  outputDir,          // Optional directory for a standalone full-size SVG.
});
// => { svg, hash, cacheHit, outputPath, versions, profile }
```

The cache key includes diagram source, macro source, wrapper, package profile, compiler/converter/version output, selected package content hashes (including the bundled Quiver bytes and system `spath3` files), and converter options. Descriptions and per-embedding IDs are applied after cache lookup, so changing accessibility text or embedding the same diagram twice does not require recompilation. The cache and generated assets are disposable build output, never canonical source.

Every compilation uses a fresh temporary working directory containing its generated wrapper and the bundled `quiver.sty`. Processes receive an allowlisted tool-path/library environment rather than the parent environment: deployment credentials and proxy tokens are not passed through. Shell escape is disabled; TeX's paranoid input/output modes forbid absolute and parent-directory reads/writes; user TeX directories point inside the temporary directory. A fixture confirms rejection of an absolute file read. The directory is removed on success and failure.

Linux/WSL adds `prlimit` bounds: 1 GiB address space, 20 CPU seconds, 16 MiB per written file, and 64 open file descriptors. Each process also has a wall-clock deadline (30 seconds for LaTeX, 15 for dvisvgm) and a 2 MiB captured-output bound. Source plus macros is limited to 128 KiB. Native errors fail the build with the original source path and useful compiler output.

These limits support **trusted repository authoring**. They do not make arbitrary hostile TeX safe for a public upload endpoint. Extending the package/library profile requires a fixture, an empty-cache rebuild, an SVG/description check, and a desktop/mobile visual inspection. Update the explicit wrapper/package list so the new profile participates in cache invalidation. Do not silently substitute a different arrow or mathematical notation when a package is unsupported.

References: [PGF manual](https://pgf-tikz.github.io/pgf/pgfmanual.pdf), [TikZ-CD](https://ctan.org/pkg/tikz-cd), [standalone](https://ctan.org/pkg/standalone), [dvisvgm manual](https://dvisvgm.de/Manpage/).
