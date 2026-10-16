# Mathematics rendering and authoring profile

The production engine is **KaTeX 0.19.0**, run at build time with HTML plus
MathML output. Reading needs no mathematics JavaScript, external font service,
or image server. Native **TikZ-CD is a separate, genuine TeX pipeline**; see
[diagrams.md](diagrams.md). Its transparent SVGs are generated from the authored
source, not drawn by the layout or checked in as replacement source material.

## Decision and evidence

The two development articles are `mathematical-writing-specimen` (medium,
proof-oriented) and `a-small-pullback` (short, conversational). Both are clearly
labeled specimens, have `draft: true` and `specimen: true`, and cannot be
published without changing their metadata and replacing their content.

The dense specimen exercises inline notation, nested fractions, aligned
displays, script/calligraphic/blackboard letters, long subscripts, accents,
all nine semantic block kinds, forward and cross-post links, footnotes, math
in headings and captions, a simple CD square, and two native TikZ-CD diagrams.
Both posts compile through the production pipeline. Formula layout, mobile
scrolling, keyboard links, no-JavaScript reading, and browser accessibility
checks are covered by the browser verification recorded in
[verification.md](verification.md).

KaTeX was selected because the tested notation works, its HTML/MathML output
fits the prose, and no runtime renderer is needed. A maintained MathJax 4
installation is evaluated on the same formula corpus by the reproducible
comparison script `src/lib/content/compare-engines.mjs`; its exact measured
results are recorded below. The MathJax dependency is development-only and
never imported by a production page. The decision does not claim that KaTeX
implements arbitrary LaTeX packages, or that MathML presence establishes
screen-reader usability.

The measured run used **KaTeX 0.19.0** and the actual **MathJax 4.1.3** package
(not a plugin embedding MathJax 3). Both rendered all **70 ordinary formulas**
from the same full article: 65 inline, 5 display, **zero errors**, and 70
MathML expressions each. The two native diagrams and all prose remain identical
in the generated comparison pages.

| Local measurement | KaTeX 0.19.0 | MathJax 4.1.3 SVG + assistive MathML |
| --- | ---: | ---: |
| Formula markup | 123,978 bytes | 430,068 bytes |
| Formula markup, gzip | 8,490 bytes | 53,577 bytes |
| Warm render time, median of 3 passes | 9.65 ms | 66.03 ms |

These are local corpus measurements, not a general engine benchmark. Timing
excludes initialization, native diagram compilation, font loading, and the
rest of the site build. KaTeX additionally needs its self-hosted CSS/fonts;
the SVG comparison embeds its glyph paths. Both engines are viable here.
KaTeX provides a smaller result for this supported notation profile while
the separate semantic reference layer supplies the document functionality.
Generated evidence is `work/engine-comparison/metrics.json` and the two full
article HTML pages; rerun the comparison command to reproduce it.
The comparison pages were inspected at 320, 390, and 1440 CSS pixels with no
page overflow and no failed font requests. Twelve retained desktop/phone
screenshots cover the full articles, dense opening prose, and proof displays.
Both engines looked coherent on the shared background; KaTeX's expressions
were somewhat narrower and integrated comfortably with the prose. The final
source SHA-256 is recorded in `metrics.json` alongside the browser inspection
in `browser-inspection.json`.

The article typography comparison uses the same full specimen with Source
Serif 4 and Inter body text, at desktop and phone widths. The selected serif
reading treatment keeps normal mathematical sizing and a restrained line
length. Native diagram labels use their tested 10pt TeX model expressed in
`em`, with padding and local scrolling; their glyph shapes are close to, but
not identical with, browser KaTeX fonts. See the screenshots and final visual
assessment in the verification report.

## Explicit supported profile

| Authoring feature | Tested support and boundary |
| --- | --- |
| Inline and display math | `$...$` and `$$` blocks; normal output is HTML plus MathML. |
| Common amsmath notation | `aligned`, `cases`, `pmatrix`, `\frac`, `\dfrac`, `\text`, `\substack`, accents, underbraces, and sums. No claim of whole-package parity. |
| Common amssymb notation | Blackboard letters, ordinary symbol relations, hooks, and two-headed arrows. |
| Selected mathtools-style notation | `\coloneqq`, extensible `\xrightarrow` and `\xhookrightarrow`. `\DeclarePairedDelimiter` is outside the shared profile; use an explicit argument macro such as `\abs`. |
| Script alphabets | `\mathscr` (script), `\mathcal` (calligraphic), `\mathbb` (blackboard), `\mathfrak` (Fraktur). |
| Simple CD | `\begin{CD} ... \end{CD}` in ordinary display math. This supplements native TikZ-CD. |
| Native diagrams | `tikzcd` fences compile with actual TeX packages. Curved, parallel, diagonal, dashed, hook, two-headed, and equality arrows are tested. |
| Document structure | Theorem, lemma, proposition, corollary, definition, remark, example, question, proof; stable labels, section and equation references, cross-post links. |
| Citations | Ordinary linked citations and a References section. BibTeX ingestion/citation-key automation is a future extension. |

`tests/math.test.mjs` exercises this notation directly, independently of the
specimen's visual review. Consult the [KaTeX supported functions
table](https://katex.org/docs/supported.html) before adding unfamiliar notation,
then test it here. Package names in this table identify familiar syntax;
ordinary article math does **not** execute `\usepackage`.

## One shared macro source, isolated documents

`src/data/math-macros.tex` is the shared notation source. Per-post definitions
go in a YAML `macros: |` block. The supported declaration profile is:

```tex
\newcommand{\pair}[2]{\langle #1,#2\rangle}
\renewcommand{\cF}{\mathcal{E}}
\DeclareMathOperator{\Hom}{Hom}
\DeclareMathOperator*{\Lim}{Lim}
```

Definitions use braced command names and zero to nine required arguments.
Optional argument defaults are deliberately rejected with an actionable
error. The small declaration parser validates boundaries; KaTeX parses the
actual mathematics. Native TeX receives the original declaration source.
For KaTeX, `\DeclareMathOperator` is explicitly adapted to a `\newcommand`
whose body uses `\operatorname` (or `\operatorname*`). The adapter preserves
operator spacing and limit placement; the operator test covers both forms.

Each document receives a fresh macro table. Each formula renders from a copy,
so `\gdef` or incidental definitions inside one formula cannot modify the next
formula or another article. Put reusable definitions in the shared file or
post frontmatter. `\renewcommand` is the explicit override mechanism. Tests
verify argument substitution, deliberate override, and build-order isolation.

The original public `/quiver-macros.tex` remains byte-identical and is **not**
automatically loaded. Its `xcolor` and `old-arrows` package directives,
`\closedimm`/`\longclosedimm` definitions, and environment-dependent renewals
need individual review. They cannot be passed to KaTeX as a package list.
No special arrow has been silently changed to an ordinary one. To introduce
one, retain the original definition, test its meaning and rendering in both
pipelines, and document a compatible adapter or keep it in native diagrams.

## References are document structure

The compiler parses Markdown into an inspectable mdast tree using unified,
remark-parse, remark-math, remark-directive, and remark-gfm. It then:

1. Validates frontmatter and chooses included documents. Production omits
   drafts before diagrams or assets are generated.
2. Collects every included post, heading, mathematical block, labeled display,
   and diagram into a registry. The theorem-like counter is shared per post;
   equation and diagram counters are separate. Proofs are unnumbered, and
   other blocks accept `unnumbered`.
3. Resolves every reference against that complete registry. Forward references
   have the same behavior as backward references. A production reference to
   a draft fails rather than linking to an unavailable page.
4. Renders mathematics, compiles diagrams, validates/copies referenced assets,
   and emits ordinary semantic HTML. Search text is taken from the source
   tree rather than renderer internals or duplicated MathML.

The relevant modules are `compile.mjs`, `references.mjs`, `macros.mjs`, and
`diagrams.mjs` under `src/lib/content`. Label resolution never searches or
rewrites finished HTML. Inserting an earlier result changes its displayed
number but preserves an explicit semantic ID.

Labels must begin with a letter and use letters, digits, `_`, `.`, `:`, or `-`.
The layout IDs `main`, `top`, and `footnote-label`, and the generated prefixes
`<post-slug>-fn-` / `<post-slug>-fnref-`, are reserved and fail validation.
Use a meaningful author label such as `lem:base-change`, not a displayed number.

```md
See :ref[lem:main] and :ref[another-post#eq:identity].

:::lemma[A useful observation]{#lem:main}
An ordinary Markdown statement with $x\in\ZZ$.
:::

$$
x=x
\label{eq:identity}
$$

The equation is $\eqref{eq:identity}$.
```

Standalone `$\eqref{...}$` and `$\ref{...}$` become ordinary accessible links.
Inside a larger formula, the reference's text stays at its mathematical
position and an adjacent visible reference link supplies navigation. This
avoids focusable anchors inside KaTeX's `aria-hidden` visual tree. Direct
`\href`, `\url`, `\includegraphics`, and other trusted HTML commands fail
explicitly; use Markdown links and document references instead. Simply
returning `false` from KaTeX's trust callback would incorrectly emit red raw
commands without failing the build.

## Errors, metadata, and accessibility limits

Unknown commands, malformed mathematics, invalid macro declarations, duplicate
labels, unknown targets, reserved route slugs, invalid calendar dates, missing
assets, and native compilation failures stop the build. Errors include the
source path and source line when available; title errors identify frontmatter.
YAML dates remain strings until semantic validation, avoiding silent date
normalization. Raw HTML is outside this Markdown profile and fails instead of
silently dropping content. Markdown links to local post routes and fragments
are validated too; root file links must belong to the explicit public asset
manifest.

Headings and titles receive a plain-text counterpart for navigation, metadata,
and search. This is a conservative textual simplification, **not semantic
formula search** or a promise to verbalize arbitrary custom notation. Use a
descriptive prose title and summary. Captions support inline Markdown/math;
diagram descriptions stay authored plain language explaining objects, arrows,
and commutativity.

KaTeX provides MathML alongside its visual HTML. Native SVGs contain an
authored title and description and retain an expandable TeX source. These
are useful foundations, not substitutes for testing with an actual screen
reader. Automated axe and browser checks are reported separately from any
manual assistive-technology verification.

## Reproducing the check

After the documented Node/TeX setup:

```sh
node --test tests/math.test.mjs
node src/lib/content/compare-engines.mjs
npm run build:preview
npm run test:browser
```

The comparison's generated files belong in ignored `work/`, not the published
site. To extend the profile, add a representative source specimen and a
focused regression, run both math and native tests where relevant, inspect
desktop and narrow-screen output, then update this guide. Unsupported complete
TeX documents require the bounded conversion process in
[authoring.md](authoring.md); renaming a `.tex` file is not a conversion.
