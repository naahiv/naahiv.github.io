import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { DOMParser } from '@xmldom/xmldom';
import { compilePosts } from '../src/lib/content/compile.mjs';

const frontmatter = '---\ntitle: Edge-case review\nslug: review\ndate: "2026-10-16"\nsummary: A temporary compiler test.\ndraft: false\n---\n';

async function fixture(t, body, files = {}) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'math-edge-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const postsDir = path.join(directory, 'posts');
  const staticDir = path.join(directory, 'static');
  await fs.mkdir(postsDir);
  await fs.writeFile(path.join(postsDir, 'review.md'), `${frontmatter}${body}\n`);
  for (const [name, contents] of Object.entries(files)) await fs.writeFile(path.join(postsDir, name), contents);
  return { postsDir, staticDir };
}

test('only the used, first-winning Markdown asset definition is copied', async (t) => {
  const options = await fixture(t, `![A figure][Chosen]

[chosen]: ./figure.svg
[chosen]: ./duplicate-secret.tex
[unused]: ./unused-secret.tex
[missing]: ./not-present.svg`, {
    'figure.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>',
    'duplicate-secret.tex': 'Duplicate definition must not be published.',
    'unused-secret.tex': 'Unused definition must not be published.',
  });
  const [post] = await compilePosts(options);
  assert.match(post.html, /src="\/post-assets\/review\/figure\.svg"/);
  assert.deepEqual(await fs.readdir(path.join(options.staticDir, 'post-assets/review')), ['figure.svg']);
  assert.doesNotMatch(post.html, /secret|not-present/);
});

test('authored semantic labels cannot collide with page or generated footnote IDs', async (t) => {
  for (const id of ['main', 'top', 'footnote-label', 'review-fn-a', 'review-fnref-a', 'review-fnref-a-2']) {
    const options = await fixture(t, `## A result {#${id}}

A footnote.[^a]

[^a]: Its content.`);
    await assert.rejects(compilePosts(options), /review\.md:\d+: Label .*reserved.*footnotes/);
  }
  const options = await fixture(t, '## A result {#result}\n\nA footnote.[^a]\n\n[^a]: Its content.');
  const [post] = await compilePosts(options);
  const ids = [...post.html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(ids.includes('result'));
  assert.ok(ids.includes('review-fn-a'));
});

test('theorem-title links and reference assets receive ordinary content validation', async (t) => {
  const broken = await fixture(t, ':::lemma[[A missing target](#absent)]{#lemma}\nThe statement.\n:::');
  await assert.rejects(compilePosts(broken), /Unresolved reference "#absent"/);
  const valid = await fixture(t, ':::lemma[[Original source][source]]{#lemma}\nThe statement.\n:::\n\n[source]: ./source.tex', { 'source.tex': 'Retained source.' });
  const [post] = await compilePosts(valid);
  assert.match(post.html, /href="\/post-assets\/review\/source\.tex"/);
  assert.equal(await fs.readFile(path.join(valid.staticDir, 'post-assets/review/source.tex'), 'utf8'), 'Retained source.');
});

test('diagram-caption links cannot bypass the asset and fragment validator', async (t) => {
  const options = await fixture(t, '```tikzcd {#square caption="[A missing target](#absent)" description="An arrow from A to B."}\n\\begin{tikzcd} A \\arrow[r] & B \\end{tikzcd}\n```');
  await assert.rejects(compilePosts(options), /Unresolved reference "#absent"/);
});

test('diagram captions and descriptions can be supplied independently without invented visible text', async (t) => {
  const caption = 'An authored caption.';
  const description = 'A maps to B.';
  const cases = [
    { id: 'neither', caption: false, description: false },
    { id: 'caption-only', caption: true, description: false },
    { id: 'description-only', caption: false, description: true },
    { id: 'both', caption: true, description: true },
  ];
  const body = cases.map(item => {
    const attributes = [`#${item.id}`, ...(item.caption ? [`caption="${caption}"`] : []), ...(item.description ? [`description="${description}"`] : [])];
    return '```tikzcd {' + attributes.join(' ') + '}\n' + String.raw`\begin{tikzcd} A \arrow[r] & B \end{tikzcd}` + '\n```';
  }).join('\n\n');
  const [post] = await compilePosts(await fixture(t, body));
  const document = new DOMParser().parseFromString(`<article>${post.html}</article>`, 'text/html');
  const figures = Array.from(document.getElementsByTagName('figure'));
  assert.equal(figures.length, cases.length);
  for (const [index, item] of cases.entries()) {
    const figure = figures[index];
    assert.equal(figure.getAttribute('id'), item.id, 'stable diagram IDs remain available');
    const captions = Array.from(figure.getElementsByTagName('figcaption'));
    const descriptions = Array.from(figure.getElementsByTagName('p')).filter(node => node.getAttribute('class') === 'diagram-description');
    const svg = figure.getElementsByTagName('svg')[0];
    const svgDescriptions = Array.from(svg.getElementsByTagName('desc'));
    assert.equal(captions.length, Number(item.caption), `${item.id}: no empty, generic, or description-derived caption`);
    if (captions.length) assert.equal(captions[0].textContent, `Diagram ${index + 1}. ${caption}`);
    assert.equal(descriptions.length, Number(item.description), `${item.id}: no empty or duplicated description paragraph`);
    if (descriptions.length) assert.equal(descriptions[0].textContent, description);
    assert.equal(svgDescriptions.length, Number(item.description), `${item.id}: no invented SVG description`);
    if (svgDescriptions.length) assert.equal(svgDescriptions[0].textContent, description);
    const ids = Array.from(svg.getElementsByTagName('*')).map(node => node.getAttribute('id')).filter(Boolean);
    for (const id of svg.getAttribute('aria-labelledby').split(/\s+/)) assert.ok(ids.includes(id), `${item.id}: accessible name references existing nodes`);
  }
});

test('a native diagram still requires a stable ID when caption and description are omitted', async (t) => {
  const options = await fixture(t, '```tikzcd\n' + String.raw`\begin{tikzcd} A \arrow[r] & B \end{tikzcd}` + '\n```');
  await assert.rejects(compilePosts(options), /stable #id/);
});
