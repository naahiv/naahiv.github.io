import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
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
