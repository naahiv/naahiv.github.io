import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { compilePosts } from '../src/lib/content/compile.mjs';

const run = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
const command = path.join(root, 'scripts/new-post.mjs');

async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), 'math-authoring-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return { directory, postsDir: path.join(directory, 'posts'), staticDir: path.join(directory, 'public'), sharedMacrosPath: path.join(root, 'src/data/math-macros.tex') };
}

test('the documented new-post command creates a draft that compiles math, references, footnotes, and native TikZ-CD', async (t) => {
  const paths = await fixture(t);
  const slug = 'a-first-observation';
  const title = 'An observation: "evaluation" and $\\ZZ$';
  const result = await run(process.execPath, [command, slug, '--title', title, '--date', '2026-10-16', '--dir', paths.postsDir], { cwd: paths.directory });
  assert.match(result.stdout, /Created draft/);
  const [post] = await compilePosts({ ...paths, includeDrafts: true });
  assert.equal(post.slug, slug);
  assert.equal(post.draft, true);
  assert.equal(post.date, '2026-10-16');
  assert.match(post.title, /An observation/);
  assert.match(post.html, /<math/);
  assert.match(post.html, /Lemma 1/);
  assert.match(post.html, /href="#lem:evaluation"/);
  assert.match(post.html, /href="#eq:evaluation"/);
  assert.match(post.html, /href="#diag:naturality"/);
  assert.match(post.html, /<svg/);
  assert.match(post.html, /<desc/);
  assert.match(post.html, /data-footnote-ref/);
  assert.equal(await readFile(path.join(paths.postsDir, slug, 'index.md'), 'utf8').then(source => source.includes('{{')), false);
  assert.deepEqual(await compilePosts({ ...paths, includeDrafts: false }), []);
  assert.deepEqual(await readdir(paths.staticDir).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error)), []);
});

test('new-post refuses overwrites and invalid slugs, dates, or options without changing existing work', async (t) => {
  const paths = await fixture(t);
  await mkdir(path.join(paths.postsDir, 'existing'), { recursive: true });
  const existing = path.join(paths.postsDir, 'existing', 'index.md');
  await writeFile(existing, 'Existing work must survive.\n');
  const attempt = (args) => run(process.execPath, [command, ...args, '--dir', paths.postsDir], { cwd: paths.directory });
  await assert.rejects(attempt(['existing']), error => /Refusing to overwrite/.test(error.stderr));
  assert.equal(await readFile(existing, 'utf8'), 'Existing work must survive.\n');
  for (const slug of ['../outside', 'Uppercase', 'double--hyphen', 'trailing-', 'with space']) {
    await assert.rejects(attempt([slug]), error => /Invalid slug/.test(error.stderr));
  }
  for (const slug of ['archive', 'tags']) {
    await assert.rejects(attempt([slug]), error => /Reserved slug/.test(error.stderr));
  }
  await assert.rejects(attempt(['bad-date', '--date', '2026-02-30']), error => /Invalid date/.test(error.stderr));
  await assert.rejects(attempt(['empty-title', '--title', ' ']), error => /title must contain/.test(error.stderr));
  await assert.rejects(attempt(['unknown-option', '--unknown']), error => /Unknown option/.test(error.stderr));
  assert.deepEqual(await readdir(paths.postsDir), ['existing']);
});
