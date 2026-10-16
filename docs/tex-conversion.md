# Converting an existing TeX passage

Convert a bounded passage into an ordinary Markdown post, then inspect the rendered mathematics. The site does not import arbitrary complete TeX documents. Keep the original TeX available for comparison; changing the filename extension is not a conversion.

1. **Select the passage.** Identify its prose, equations, theorem environments, labels, citations, macros, and diagrams. Record its source file and boundaries. Preserve the mathematical claims and distinguish the author's prose from quoted material.
2. **Create a draft.** Run `npm run new:post -- descriptive-slug --title "Title"`. Replace its instructional content. Add a useful summary and tags; leave `draft: true` while checking the result. Keep confidential source outside the public repository.
3. **Map prose.** Convert `\section`/`\subsection` to Markdown headings; put stable `{#section-label}` labels on headings. Convert emphasis and lists to Markdown. Use `$...$` inline and `$$` delimiters on separate lines for displays. Preserve meaningful `aligned` breaks. An `align` block with separately numbered lines should become separately labeled display blocks when each line needs its own reference.
4. **Audit macros.** Move shared portable definitions into `src/data/math-macros.tex`, and passage-specific definitions into frontmatter `macros: |`. Test each definition against [math-rendering.md](math-rendering.md). Familiar `\newcommand{\name}[n]{...}`, deliberate `\renewcommand`, and `\DeclareMathOperator` work. Remove package declarations from article macro sources. Preserve the original notation whenever adapting a command; record every unsupported construct before deciding how to handle it.
5. **Map statements and references.** Use the actual directive syntax below. Keep semantic labels, letting the build assign numbers. Use `:ref[label]` in prose and `\ref{label}`/`\eqref{label}` in math. Cross-post references are `:ref[other-slug#label]`. References to excluded drafts correctly fail production builds.
6. **Keep native diagrams.** Copy each complete `\begin{tikzcd}...\end{tikzcd}` into a `tikzcd` Markdown fence. Add a stable ID and a plain-text description of objects, arrows, and commutativity. Move its portable macros to shared/post source. The original TeX is retained in the post and compiled automatically; never replace a special arrow with a convenient but mathematically different one. See [diagrams.md](diagrams.md) if a package or TikZ library needs extending.
7. **Resolve citations and assets.** Convert citation commands into ordinary descriptive links and an accurate References section. BibTeX automation is a follow-up, not supported syntax. Copy referenced figures into the post directory, retain attribution, and supply useful alternative text. Link existing portfolio PDFs by their preserved root URLs.
8. **Build and compare.** Run `npm run build:preview` and `node scripts/serve.mjs dist-preview 4321`. Compare source and output line by line for signs, indices, quantifiers, arrows, and hypotheses. Inspect at desktop and 320/390-pixel widths, follow each reference, and test local overflow. Run `npm test` and the production checks in [authoring.md](authoring.md) before considering publication.

Theorem conversion:

```tex
\begin{lemma}[Evaluation]\label{lem:evaluation}
Evaluation at $1$ identifies $\Hom(\ZZ,A)$ with $A$.
\end{lemma}
\begin{proof}
Send $a$ to the homomorphism $n\mapsto na$.
\end{proof}
See Lemma~\ref{lem:evaluation}.
```

becomes:

```markdown
:::lemma[Evaluation]{#lem:evaluation}
Evaluation at $1$ identifies $\Hom(\ZZ,A)$ with $A$.
:::

:::proof
Send $a$ to the homomorphism $n\mapsto na$.
:::

See :ref[lem:evaluation].
```

Use the built-in reference text instead of writing a second “Lemma” before it. Theorem-like blocks share a counter; equation numbering is separate and opt-in through `\label`. Named unnumbered blocks use `{#stable-label unnumbered}`. Proofs are unnumbered automatically.

A conversion review should state which source passage was converted, which macros were adapted, whether any diagrams/packages remain unsupported, and which browser checks were performed. Do not silently change equality to equivalence, remove an arrow decoration, simplify a hypothesis, invent a reference, or claim a construct is supported merely because the build did not encounter it. A clear unsupported-construct report is preferable to altered mathematics.
