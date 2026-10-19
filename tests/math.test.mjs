import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { DOMParser } from '@xmldom/xmldom';
import { compilePosts } from '../src/lib/content/compile.mjs';
import { createMathContext, validateMacroSource, plainTitle } from '../src/lib/content/macros.mjs';

async function fixture(t, entries) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'math-posts-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const postsDir = path.join(directory, 'posts');
  const staticDir = path.join(directory, 'static');
  await fs.mkdir(postsDir);
  for (const [name, source] of Object.entries(entries)) {
    await fs.mkdir(path.dirname(path.join(postsDir, name)), { recursive: true });
    await fs.writeFile(path.join(postsDir, name), source);
  }
  return { postsDir, staticDir };
}

function post(slug, body, extra = '') {
  return `---\ntitle: Test ${slug}\nslug: ${slug}\ndate: 2026-10-16\nsummary: A mathematical test.\ntags: [mathematics]\ndraft: false\n${extra}---\n${body}\n`;
}

test('two-phase references resolve forward, colon, equation, section, and cross-post targets', async (t) => {
  const options = await fixture(t, {
    'a.md': post('a', String.raw`:ref[lem:later], :ref[b#other], $\eqref{eq:main}$, :ref[section].

## Section {#section}

:::lemma[A later lemma]{#lem:later}
Its statement contains $x^2$.
:::

$$
x=1
\label{eq:main}
$$`),
    'b.md': post('b', ':::theorem{#other}\nA result.\n:::\n\n:post[a]'),
  });
  const results = await compilePosts(options);
  const html = results.find((entry) => entry.slug === 'a').html;
  assert.match(html, /href="#lem:later"[^>]*>Lemma 1<\/a>/);
  assert.match(html, /href="\/blog\/b\/#other"[^>]*>Theorem 1<\/a>/);
  assert.match(html, /href="#eq:main"/);
  assert.match(html, /id="section"/);
  assert.match(html, /class="equation-number"[^>]*>\(1\)<\/a>/);
  assert.match(html, /<math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/);
  assert.doesNotMatch(results[0].searchText, /katex|aria-|<span|<math/);
});

test('theorem-like blocks share a counter; proofs and named unnumbered blocks do not advance it', async (t) => {
  const body = ['definition', 'theorem', 'proof', 'lemma', 'proposition', 'corollary', 'remark', 'example', 'question'].map((kind) => `:::${kind}{#${kind}}\nContent.\n:::`).join('\n\n');
  const options = await fixture(t, { 'a.md': post('a', `${body}\n\n:::remark[Convention]{#convention unnumbered}\nText.\n:::\n\n:ref[convention]`) });
  const [result] = await compilePosts(options);
  assert.deepEqual(result.refs.filter((entry) => entry.number).map((entry) => entry.number), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.match(result.html, /aria-label="End of proof"/);
  assert.match(result.html, /href="#convention"[^>]*>Convention<\/a>/);
});

test('block labels run into opening prose without moving later paragraphs or display content', async (t) => {
  const options = await fixture(t, { 'a.md': post('a', String.raw`
:::theorem[Named result]{#result}
First statement with $X$.

Second paragraph.
:::

:::proof
The proof starts here.
:::

:::definition{#display-first}
$$
X = Y
$$

Explanation after the display.
:::

:::remark{#list-first}
- First item.

Explanation after the list.
:::
`) });
  const [result] = await compilePosts(options);
  const document = new DOMParser().parseFromString(`<article>${result.html}</article>`, 'text/html');
  const sections = Array.from(document.getElementsByTagName('section'));
  const elements = (node) => Array.from(node.childNodes).filter((child) => child.nodeType === 1);
  const theorem = sections.find((node) => node.getAttribute('id') === 'result');
  const paragraphs = elements(theorem);
  assert.deepEqual(paragraphs.map((node) => node.tagName), ['p', 'p']);
  assert.match(paragraphs[0].textContent, /^Theorem 1 \(Named result\)\.¶ First statement/);
  assert.equal(paragraphs[0].getElementsByTagName('math').length, 1);
  assert.equal(paragraphs[1].textContent, 'Second paragraph.');
  assert.equal(paragraphs[0].getElementsByTagName('a')[0].getAttribute('href'), '#result');
  const proof = sections.find((node) => node.getAttribute('class').includes('math-block--proof'));
  assert.equal(elements(proof)[0].textContent, 'Proof. The proof starts here. □');
  assert.equal(elements(proof)[0].lastChild.getAttribute('aria-label'), 'End of proof');
  for (const [id, blockTag] of [['display-first', 'div'], ['list-first', 'ul']]) {
    const section = sections.find((node) => node.getAttribute('id') === id);
    assert.deepEqual(elements(section).map((node) => node.tagName), ['p', blockTag, 'p']);
    assert.match(elements(section)[2].textContent, /^Explanation after/);
  }
});

test('collapsible blocks expose their label separately and honor both initial states for every kind', async (t) => {
  const kinds = ['theorem', 'lemma', 'proposition', 'corollary', 'definition', 'remark', 'example', 'question', 'proof'];
  const states = [['collapsible', true], ['collapsed', false], ['collapsible collapsed', false]];
  const body = kinds.flatMap((kind) => states.map(([flags], index) => `:::${kind}{#${kind}-${index} ${flags}}\nBody for ${kind}.\n:::`)).join('\n\n');
  const options = await fixture(t, { 'a.md': post('a', `${body}\n\n:::remark{#ordinary}\nOrdinary body.\n:::`) });
  const [result] = await compilePosts(options);
  const document = new DOMParser().parseFromString(`<article>${result.html}</article>`, 'text/html');
  const disclosures = Array.from(document.getElementsByTagName('details'));
  assert.equal(disclosures.length, kinds.length * states.length);
  for (const kind of kinds) {
    for (const [index, [, open]] of states.entries()) {
      const disclosure = disclosures.find((node) => node.getAttribute('id') === `${kind}-${index}`);
      assert(disclosure, `${kind} supports ${states[index][0]}`);
      assert.equal(disclosure.hasAttribute('open'), open);
      assert(disclosure.getAttribute('class').split(/\s+/).includes('math-block--collapsible'));
      const children = Array.from(disclosure.childNodes).filter((node) => node.nodeType === 1);
      assert.equal(children[0].tagName, 'summary');
      assert.match(children[0].textContent, new RegExp(`^${kind[0].toUpperCase()}${kind.slice(1)}`));
      assert.doesNotMatch(children[0].textContent, /Body for/);
      assert.equal(children[0].getElementsByTagName('a')[0].getAttribute('href'), `#${kind}-${index}`);
      assert.equal(children[1].getAttribute('class'), 'math-block-body');
      assert.match(children[1].textContent, new RegExp(`^Body for ${kind}\\.`));
    }
  }
  const ordinary = Array.from(document.getElementsByTagName('section')).find((node) => node.getAttribute('id') === 'ordinary');
  assert(ordinary, 'unflagged blocks retain their section structure');
  assert.match(ordinary.getElementsByTagName('p')[0].textContent, /^Remark 25\.¶ Ordinary body\./);
});

test('collapsed rich content retains numbering, references, escaped titles, and nested proof content', async (t) => {
  const options = await fixture(t, {
    'a.md': post('a', String.raw`:ref[clarification] and :ref[next].

::::remark[**Clarification** for $X$ & "quoted" &lt;tag&gt;]{#clarification collapsed}
First paragraph with $X$.

Second paragraph.

- A list item with :ref[next].

$$
X = Y
\label{eq:inside}
$$

:::proof[The details]{#nested-proof collapsed}
The nested proof uses :ref[eq:inside].
:::
::::

:::theorem{#next}
The following theorem.
:::`),
    'b.md': post('b', ':ref[a#clarification] and :ref[a#eq:inside].'),
  });
  const results = await compilePosts(options);
  const result = results.find((entry) => entry.slug === 'a');
  const document = new DOMParser().parseFromString(`<article>${result.html}</article>`, 'text/html');
  const disclosure = Array.from(document.getElementsByTagName('details')).find((node) => node.getAttribute('id') === 'clarification');
  const [summary, body] = Array.from(disclosure.childNodes).filter((node) => node.nodeType === 1);
  assert.equal(summary.getElementsByTagName('strong')[0].textContent, 'Clarification');
  assert.equal(summary.getElementsByTagName('math').length, 1);
  assert.match(summary.textContent, /& "quoted" <tag>/);
  assert.equal(document.getElementsByTagName('tag').length, 0, 'title text cannot introduce HTML elements');
  assert.doesNotMatch(summary.textContent, /First paragraph|Second paragraph|list item|nested proof/);
  assert.deepEqual(Array.from(body.childNodes).filter((node) => node.nodeType === 1).map((node) => node.tagName), ['p', 'p', 'ul', 'div', 'details']);
  const proof = body.getElementsByTagName('details')[0];
  assert.equal(proof.getAttribute('id'), 'nested-proof');
  assert.doesNotMatch(proof.getElementsByTagName('summary')[0].textContent, /□|nested proof uses/);
  assert.equal(Array.from(proof.getElementsByTagName('span')).filter((node) => node.getAttribute('aria-label') === 'End of proof').length, 1);
  assert.deepEqual(result.refs.filter((entry) => ['remark', 'theorem'].includes(entry.kind)).map((entry) => entry.number), [1, 2]);
  assert.match(result.html, /href="#clarification"[^>]*>Remark 1<\/a>/);
  assert.match(result.html, /href="#next"[^>]*>Theorem 2<\/a>/);
  assert.match(result.html, /href="#eq:inside"[^>]*>Equation \(1\)<\/a>/);
  assert.match(results.find((entry) => entry.slug === 'b').html, /href="\/blog\/a\/#clarification"[^>]*>Remark 1<\/a>/);
  assert.match(results.find((entry) => entry.slug === 'b').html, /href="\/blog\/a\/#eq:inside"[^>]*>Equation \(1\)<\/a>/);
});

test('collapsible proofs keep the QED in the body for paragraph and display endings', async (t) => {
  const options = await fixture(t, { 'a.md': post('a', String.raw`
:::proof{#paragraph-proof collapsible}
The final sentence.
:::

:::proof{#display-proof collapsed}
$$
X = X
$$
:::
`) });
  const [result] = await compilePosts(options);
  const document = new DOMParser().parseFromString(`<article>${result.html}</article>`, 'text/html');
  for (const proof of Array.from(document.getElementsByTagName('details'))) {
    const [summary, body] = Array.from(proof.childNodes).filter((node) => node.nodeType === 1);
    assert.doesNotMatch(summary.textContent, /□/);
    const qed = Array.from(body.getElementsByTagName('span')).filter((node) => node.getAttribute('aria-label') === 'End of proof');
    assert.equal(qed.length, 1);
    assert.equal(qed[0].parentNode, proof.getAttribute('id') === 'paragraph-proof' ? body.getElementsByTagName('p')[0] : body);
    assert.equal(qed[0].parentNode.lastChild, qed[0]);
  }
});

test('collapsed content still rejects invalid mathematics and unresolved references', async (t) => {
  for (const [body, expected] of [
    [String.raw`:::remark{collapsed}
$\thisCommandDoesNotExist{x}$
:::`, /Invalid mathematics.*Undefined control sequence/s],
    [String.raw`:::remark[An invalid $\thisCommandDoesNotExist$ title]{collapsed}
Body.
:::`, /Invalid mathematics.*Undefined control sequence/s],
    [':::remark{collapsed}\n:ref[missing]\n:::', /Unresolved reference "missing"/],
  ]) {
    const options = await fixture(t, { 'a.md': post('a', body) });
    await assert.rejects(compilePosts(options), expected);
  }
});

test('macro arguments, deliberate overrides, operators, and fresh per-document state', () => {
  const shared = String.raw`\newcommand{\F}{\mathcal{F}}
\newcommand{\pair}[2]{\langle #1,#2\rangle}
\DeclareMathOperator{\Hom}{Hom}
\DeclareMathOperator*{\Lim}{Lim}`;
  const first = createMathContext(shared, String.raw`\renewcommand{\F}{\mathcal{E}}\newcommand{\private}{x}`);
  const second = createMathContext(shared);
  assert.match(first.render(String.raw`\F\pair{x}{y}\Hom(A,B)\Lim_{n} A_n`), /mathvariant="script">E/);
  assert.match(second.render(String.raw`\F`), /mathvariant="script">F/);
  assert.throws(() => second.render(String.raw`\private`), /Undefined control sequence/);
  first.render(String.raw`\gdef\inside{x}\inside`);
  assert.throws(() => first.render(String.raw`\inside`), /Undefined control sequence/);
  assert.throws(() => validateMacroSource(String.raw`\usepackage{tikz}`), /only \\newcommand/);
  assert.throws(() => validateMacroSource(String.raw`\newcommand{\F}[1][x]{#1}`), /optional macro argument defaults/);
});

test('documented mathematical notation profile renders without whole-package claims', () => {
  const context = createMathContext('');
  for (const expression of [
    String.raw`\begin{aligned}f(x)&=\dfrac{1}{1+x^2}\\g(x)&=\begin{cases}x&x\ge0\\-x&x<0\end{cases}\end{aligned}`,
    String.raw`\mathbb{Z}\quad\mathcal{F}\quad\mathscr{L}\quad\mathfrak{m}\quad\twoheadrightarrow\quad\hookrightarrow`,
    String.raw`A\coloneqq\begin{pmatrix}1&0\\0&1\end{pmatrix}\qquad A\xrightarrow{f}B\xhookrightarrow{}C`,
    String.raw`\underbrace{\sum_{\substack{0\le i\le n\\j\in J}}a_{ij}}_{\text{a finite sum}}\quad\widehat{A}\quad\widetilde{B}`,
    String.raw`\begin{CD}A @>{f}>> B\\@V{g}VV @VV{h}V\\C @>>{k}> D\end{CD}`,
  ]) assert.match(context.render(expression, true), /<math /);
});

test('mixed-formula references preserve their mathematical position and expose ordinary accessible links', async (t) => {
  const options = await fixture(t, { 'a.md': post('a', String.raw`Use $x=1\text{ by }\eqref{eq:main}$.

$$
x=1\label{eq:main}
$$`) });
  const [result] = await compilePosts(options);
  assert.match(result.html, /class="formula-reference-links"/);
  assert.match(result.html, /<a href="#eq:main" class="math-reference"[^>]*>Equation \(1\)<\/a>/);
  const document = new DOMParser().parseFromString(`<article>${result.html}</article>`, 'text/html');
  for (const span of Array.from(document.getElementsByTagName('span')).filter((element) => element.getAttribute('aria-hidden') === 'true')) assert.equal(span.getElementsByTagName('a').length, 0);
});

test('math renders in headings, named blocks, lists, and footnotes; metadata stays plain', async (t) => {
  const options = await fixture(t, { 'a.md': post('a', String.raw`## Maps into $\mathbb{R}$ {#maps}

:::lemma[Maps from $T$]{#result}
- The map $x\mapsto x^2$ is defined on $\RR$.
:::

An observation.[^one]

[^one]: The footnote contains $x^2$.`) });
  const [result] = await compilePosts(options);
  assert.equal(result.headings[0].text, 'Maps into R');
  assert.equal((result.html.match(/class="katex"/g) || []).length, 5);
  assert.match(result.html, /data-footnotes/);
  assert.equal(plainTitle(String.raw`The $\mathbb{R}$ case`), 'The R case');
});

test('unknown commands, invalid math, missing and duplicate targets fail with file and line', async (t) => {
  for (const [body, expected] of [
    [String.raw`$\thisCommandDoesNotExist{x}$`, /a\.md:9: Invalid mathematics.*Undefined control sequence/s],
    [String.raw`$\frac{x}{$`, /Invalid mathematics/],
    [':ref[missing]', /Unresolved reference "missing"/],
    [':ref[unknown#target]', /Unknown cross-post target/],
    ['## One {#same}\n\n:::lemma{#same}\nDuplicate.\n:::', /Duplicate label "same"/],
    [':::lemma{#item}\nText.\n:::\n\n$\\eqref{item}$', /must refer to an equation/],
  ]) {
    const options = await fixture(t, { 'a.md': post('a', body) });
    await assert.rejects(compilePosts(options), expected);
  }
});

test('metadata validation rejects malformed dates, unknown keys, and publishable specimens', async (t) => {
  for (const [content, expected] of [
    [post('a', '').replace('2026-10-16', '2026-02-30'), /invalid frontmatter/],
    [post('a', '', 'typo: yes\n'), /Unrecognized key/],
    [post('a', '', 'specimen: true\n'), /must remain drafts/],
  ]) {
    const options = await fixture(t, { 'a.md': content });
    await assert.rejects(compilePosts(options), expected);
  }
});

test('drafts and their assets stay out of production; a production post cannot reference a draft', async (t) => {
  const draft = post('draft', '![Private marker](./marker.svg)').replace('draft: false', 'draft: true');
  const options = await fixture(t, { 'draft/index.md': draft, 'draft/marker.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>' });
  assert.deepEqual(await compilePosts(options), []);
  await assert.rejects(fs.access(path.join(options.staticDir, 'post-assets/draft/marker.svg')), /ENOENT/);
  const preview = await compilePosts({ ...options, includeDrafts: true });
  assert.match(preview[0].html, /\/post-assets\/draft\/marker.svg/);
  assert.equal(await fs.readFile(path.join(options.staticDir, 'post-assets/draft/marker.svg'), 'utf8'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  await fs.writeFile(path.join(options.postsDir, 'public.md'), post('public', ':post[draft]'));
  await assert.rejects(compilePosts(options), /Unknown post "draft"/);
});

test('missing assets and traversal fail before publication', async (t) => {
  for (const [body, expected] of [
    ['![Missing](./missing.svg)', /Missing post asset/],
    ['![Missing](/not-a-real-file.pdf)', /Missing root asset/],
    ['![Escape](../marker.svg)', /must be inside their post directory/],
    ['[Source](./private.mjs)', /Unsupported relative asset/],
    ['[Source](/package.json)', /outside the explicit public manifest/],
    ['[Unknown](#missing)', /Unresolved reference/],
    ['[Unknown](/blog/missing/)', /Unknown post/],
    ['<div>Hidden prose</div>', /Raw HTML is outside/],
    [String.raw`$\href{https://example.com}{x}$`, /Unsupported trusted TeX command/],
    [String.raw`$\includegraphics{figure.png}$`, /Unsupported trusted TeX command/],
  ]) {
    const options = await fixture(t, { 'a.md': post('a', body) });
    await assert.rejects(compilePosts(options), expected);
  }
});

test('encoded asset names preserve their URL and invalid title math has file context', async (t) => {
  const options = await fixture(t, { 'a.md': post('a', '![An image](./a%23b.svg)'), 'a#b.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>' });
  const [result] = await compilePosts(options);
  assert.match(result.html, /src="\/post-assets\/a\/a%23b.svg"/);
  await fs.writeFile(path.join(options.postsDir, 'a.md'), post('a', '').replace('title: Test a', String.raw`title: 'The $\unknowncommand$ case'`));
  await assert.rejects(compilePosts(options), /a\.md: invalid mathematics in frontmatter title/);
});

test('real demanding and short specimens compile with native diagrams and all stable targets', async () => {
  const posts = await compilePosts({ includeDrafts: true });
  const dense = posts.find((entry) => entry.slug === 'mathematical-writing-specimen');
  assert(dense);
  assert.equal((dense.html.match(/class="tikzcd-svg"/g) || []).length, 2);
  assert.match(dense.html, /id="hom-pullback"/);
  assert.match(dense.html, /id="universal-property"/);
  assert.match(dense.html, /id="a-long-expression"/);
  assert.match(dense.html, /class="math-block math-block--proof"/);
  assert.match(dense.html, /<figcaption>[\s\S]*?class="katex"/);
  const document = new DOMParser().parseFromString(`<article>${dense.html}</article>`, 'text/html');
  for (const span of Array.from(document.getElementsByTagName('span')).filter((element) => element.getAttribute('aria-hidden') === 'true')) assert.equal(span.getElementsByTagName('a').length, 0, 'visual math must not contain hidden keyboard-focusable references');
  assert.doesNotMatch(dense.html, /katex-error/);
  assert.equal(posts.find((entry) => entry.slug === 'a-small-pullback').refs.length, 1);
  const production = await compilePosts();
  assert(production.every((entry) => !entry.draft && !entry.specimen));
  assert(!production.some((entry) => ['mathematical-writing-specimen', 'a-small-pullback'].includes(entry.slug)));
});
