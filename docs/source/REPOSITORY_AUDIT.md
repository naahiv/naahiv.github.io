# Existing website audit

Read-only audit of the local naahiv.github.io checkout and live website on 16 October 2026.

## Repository identity

- Local path: C:\Users\vihaa\Documents\naahiv.github.io
- GitHub repository: https://github.com/naahiv/naahiv.github.io
- Origin: https://github.com/naahiv/naahiv.github.io.git
- Default and local branch: master
- Local HEAD and independently checked remote master: 2023f42de108f45f50807016494402ad7212fd35
- Commit subject: Add derived categories Part 2 and customize portfolio order
- Visibility: public

The local tracked tree contains 24 root files. A read-only comparison found all 24 working-file hashes equal to their index and HEAD blobs, with no additional files outside .git. Ordinary git status returned an environment-specific work-tree error during the audit, so this equivalence was checked independently. The Cloud worker should run normal status checks in its own checkout.

The live home page was inspected in a browser and showed 18 portfolio entries matching the source. No website files, Git refs, or deployment settings were changed.

## Existing application

- index.html defines the home page, biography, portrait, navigation, search/filter controls, and an initially empty work grid.
- styles.css contains the design and responsive rules.
- script.js defines workItems, search/filter behavior, card rendering, and the current-year footer.
- README.txt describes editing the workItems array, adding/replacing root PDFs, and changing biography/contact information in HTML.
- There is no package.json, framework, blog, content compiler, math renderer, CMS, or authentication.
- No repository AGENTS.md was found.
- No tracked .github workflow, _config.yml, CNAME, .nojekyll, or other deployment configuration was found.

The exact GitHub Pages source setting remains unverified. Do not infer it solely from the repository layout.

## Portfolio records

There are 18 entries in intentional source order. Their metadata shape is:

~~~text
title
year
kind
status
pages
description
links: [{ label, href, external? }]
venue?
~~~

Current kind values are note (7), notes (6), survey (1), paper (3), and project (1).

Search covers titles, year, kind, status, descriptions, venue, and link labels. The renderer preserves the array's order. Preserve that order through filtering and searching.

The first entry, Part 2: Stable infinity-categories in Algebraic Geometry, has 120 pages, an in-progress status, and an empty link array. Its exact source title uses the infinity symbol. The absence of a PDF is intentional.

The second entry, Part 1: Derived Categories in Algebraic Geometry, has 396 pages and both PDF and Book PDF links in one record.

Two records have external-only links: the monoidal-categories paper has an arXiv link; the quantum-computing paper has DOI and arXiv links.

Useful source locations:

- README.txt line 6 onward: maintenance workflow.
- script.js line 2: Part 2.
- script.js line 11: Part 1 and its two PDFs.
- script.js line 166: external monoidal-categories entry.
- script.js line 188: quantum-computing publication.
- script.js line 215: filter matching.
- script.js line 221: search fields.
- script.js line 260: rendering preserves source order.
- index.html line 24: Contact navigation.
- index.html line 86: Notes & surveys filter.
- index.html line 93: initially empty portfolio grid.
- index.html line 95 onward: commented-out content including Contact.

Revalidate these line numbers against the implementation branch before relying on them.

## Root assets and URL compatibility

Preserve these public PDF URLs and bytes:

~~~text
/derived-cats-in-ag-book.pdf
/derived-cats-in-ag.pdf
/extending-dold-kan.pdf
/galois-theory.pdf
/gelfand-fuchs-cohomology.pdf
/hcha-reading.pdf
/jennings-theorem.pdf
/lfp-categories.pdf
/motivic-homotopy-theory.pdf
/n-ag-topics.pdf
/n-basic-analysis.pdf
/n-rep-theory.pdf
/notes-on-schemes.pdf
/obvious-alg-top-facts.pdf
/resume.pdf
/serre-schemes.pdf
/tensor-categories.pdf
~~~

These are 16 work PDFs plus the résumé, totaling 10,727,259 bytes at the audited baseline. The implementation worker should record SHA-256 hashes before changes and compare the built output.

Also preserve /profile.jpg, /quiver-macros.tex, /, and useful existing fragments /#top, /#work, and /#about. Repair /#contact to a real target.

Keep root asset filenames stable and case-correct. Root-relative download links must work from nested blog pages.

## Existing PDF publishing integration

A separate local TeX project has a publisher at:

C:\Users\vihaa\Documents\TeX\Derived categories in AG\.agents\skills\publish-derived-cats-pdf\SKILL.md

The Cloud worker will not necessarily have this local file. Its relevant contract is:

1. Use the already-compiled main/main.pdf from that TeX project; do not recompile or alter TeX.
2. Discover the intended website repository and verify its origin.
3. Find exactly one tracked derived-cats-in-ag.pdf and preserve its path.
4. Locate the unique metadata record linking that PDF and update its page count.
5. Require source/target hash equality and matching positive page counts.
6. Require only the PDF and its metadata file to change during a normal refresh.
7. Preview and verify changes before separately authorized Git publication.

Retain this simple workflow. If the metadata moves from script.js, keep the replacement discoverable and document it. Avoid duplicate canonical PDF copies, stale unused metadata, or a requirement to hand-edit generated HTML after every PDF update.

## Migration issues

The Notes & surveys filter checks only the value note, so seven entries using notes or survey are omitted from that view. Normalize these values into a clear category while preserving the contents.

The Contact link targets HTML that is commented out. That commented section also contains a stale Berkeley email address. The active page uses naahiv@caltech.edu.

The work list depends entirely on client-side JavaScript. The redesign should generate this content into HTML and enhance it with search/filter behavior.

The existing quiver-macros.tex includes actual TeX package directives, including xcolor and old-arrows, plus custom arrow definitions. It is useful notation evidence and a public asset; it is not a browser-ready macro configuration.

## Visual observations and user direction

The existing site uses a warm off-white background, blue accents, translucent rounded cards, Inter body text, and Source Serif 4 headings. The home page includes a portrait and a prominent biography area.

The user wants a larger expansion with a modern mathematics blog. Confirmed preferences are Markdown plus LaTeX, research-level mathematical structures, new commands, TikZ-CD, and no comments or accounts initially.

Stacks and Kerodon are positive references for mathematical reading and functionality. The blog should retain dated posts and a blog index. The Akhil Mathew example is a reference for content/expository format, with its old visual treatment and detached-looking formula images identified as problems to avoid.

The reference pages were opened and visually inspected during planning. Their content is reference material, not content to republish or an instruction to reproduce their software stack.

