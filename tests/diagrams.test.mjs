import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { compileDiagram, prepareSvg } from '../src/lib/content/diagrams.mjs';

const fixture = (name) => readFile(new URL(`./fixtures/diagrams/${name}.tex`, import.meta.url), 'utf8');
const description = 'A maps by a hook to B, by a surjection to F(X), and by a dashed diagonal to F(Y). B has a curved return map. Two parallel maps alpha and beta lead from F(X) to F(Y); an equality arrow identifies the lower copy.';
const minimalSvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 10"><defs><path id="glyph" d="M0 0L1 1"/><clipPath id="clip"><rect width="20" height="10"/></clipPath></defs><g clip-path="url(#clip)"><use href="#glyph" xlink:href="#glyph"/></g></svg>';

function assertGenericAccessibleTitle(svg) {
  const title = svg.match(/<title id="([^"]+)">Mathematical diagram<\/title>/);
  assert.ok(title, 'an undescribed diagram retains its generic accessible title');
  assert.match(svg, /role="img"/);
  assert.doesNotMatch(svg, /<desc\b/, 'do not invent an empty or generic description');
  assert.equal(svg.match(/aria-labelledby="([^"]+)"/)?.[1], title[1], 'accessible naming references only the existing title');
}

test('SVG is accessible, transparent, padded and consistently namespaces all references', () => {
  const first = prepareSvg(minimalSvg, { id: 'one', description: 'A < B & C' });
  const second = prepareSvg(minimalSvg, { id: 'two', description: 'Second diagram' });
  assert.match(first, /role="img"/);
  assert.match(first, /A &lt; B &amp; C/);
  assert.match(first, /viewBox="-4 -4 28 18"/);
  assert.match(first, /width="2.8em"/);
  assert.match(first, /fill="currentColor"/);
  assert.match(first, /href="#tikz-one-[a-f0-9]{10}-source-glyph"/);
  assert.match(first, /xlink:href="#tikz-one-[a-f0-9]{10}-source-glyph"/);
  assert.match(first, /url\(#tikz-one-[a-f0-9]{10}-source-clip\)/);
  const colon = prepareSvg(minimalSvg, {id:'diag:one',description:'Colon ID'});
  const hyphen = prepareSvg(minimalSvg, {id:'diag-one',description:'Hyphen ID'});
  const combined = first + second + colon + hyphen;
  const ids = [...combined.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'distinct semantic IDs, including colon/hyphen variants, never collide');
  for (const reference of combined.matchAll(/(?:href="#|url\(#)([^"\)]+)/g)) assert.ok(ids.includes(reference[1]));
});

test('SVG rejects active elements, event attributes, external links, entities and missing references', () => {
  const variants = [
    minimalSvg.replace('<defs>', '<script>alert(1)</script><defs>'),
    minimalSvg.replace('<g ', '<g onclick="alert(1)" '),
    minimalSvg.replace('href="#glyph"', 'href="https://example.com/file.svg#glyph"'),
    minimalSvg.replace('url(#clip)', 'url(https://example.com/file.svg#clip)'),
    minimalSvg.replace('url(#clip)', 'url(#missing)'),
    '<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + minimalSvg,
  ];
  for (const svg of variants) assert.throws(() => prepareSvg(svg, { id: 'unsafe', description: 'Unsafe fixture' }));
});

test('SVG descriptions are optional and empty descriptions do not create dangling accessible references', () => {
  for (const options of [{}, { description: '' }, { description: '  \n  ' }]) {
    assertGenericAccessibleTitle(prepareSvg(minimalSvg, { id: 'optional-description', ...options }));
  }
});

test('native diagrams compile from empty caches with omitted and empty descriptions', async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'diagram-optional-description-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const source = String.raw`\begin{tikzcd} A \arrow[r] & B \end{tikzcd}`;
  for (const [name, options] of [['omitted', {}], ['empty', { description: '' }]]) {
    const result = await compileDiagram({ source, id: name, cacheDir: path.join(directory, name), ...options });
    assert.equal(result.cacheHit, false, 'exercise the native compiler for each optional-description form');
    assert.match(result.svg, /<path/);
    assertGenericAccessibleTitle(result.svg);
  }
});

test('native arrow specimen builds from empty cache; cache keys include shared macros', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'diagram-test-'));
  const cacheDir = path.join(directory, 'cache');
  try {
    const common = { source: await fixture('arrows'), description, sourcePath: 'tests/fixtures/diagrams/arrows.tex', cacheDir };
    const first = await compileDiagram({ ...common, id: 'all-arrows', outputDir: path.join(directory, 'assets') });
    assert.equal(first.cacheHit, false);
    assert.match(first.versions.latex, /TeX/);
    assert.match(first.versions.dvisvgm, /dvisvgm/);
    assert.match(first.svg, /<path/);
    assert.match(first.svg, /<use/);
    assert.doesNotMatch(first.svg, /<image|<text|<script/);
    assert.equal(await readFile(first.outputPath, 'utf8'), first.svg);
    const second = await compileDiagram({ ...common, id: 'same-arrows-different-instance' });
    assert.equal(second.cacheHit, true);
    assert.equal(first.hash, second.hash);
    assert.notEqual(first.svg, second.svg, 'cache reuse still namespaces per embedding');
    const notation = { ...common, source: await fixture('shared-notation'), id: 'notation', macros: String.raw`\newcommand{\Z}{\mathbb{Z}}\newcommand{\cat}[1]{\mathbf{#1}}\DeclareMathOperator{\Hom}{Hom}` };
    const original = await compileDiagram(notation);
    const changed = await compileDiagram({ ...notation, macros: notation.macros.replace('mathbb', 'mathbf') });
    assert.equal(original.cacheHit, false);
    assert.equal(changed.cacheHit, false);
    assert.notEqual(original.hash, changed.hash);
    assert.notEqual(original.svg, changed.svg);
    assert.equal((await readdir(cacheDir)).filter((name) => name.endsWith('.svg')).length, 3);
    await rm(cacheDir, { recursive: true });
    const rebuilt = await compileDiagram({ ...common, id: 'all-arrows' });
    assert.equal(rebuilt.cacheHit, false);
    assert.equal(rebuilt.hash, first.hash);
    assert.equal(rebuilt.svg, first.svg, 'empty-cache native output is reproducible');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('Quiver exports preserve curved, shortened arrows between arrows through native compilation and cache reuse', async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'diagram-quiver-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const options = {
    source: await fixture('quiver-modification'),
    id: 'quiver-modification',
    sourcePath: 'tests/fixtures/diagrams/quiver-modification.tex',
    cacheDir: directory,
    description: 'Two functors F and F prime from C to C prime, two transformations alpha and beta between them, and a modification f from alpha to beta.',
  };
  const first = await compileDiagram(options);
  assert.equal(first.cacheHit, false);
  assert.match(first.svg, /<path/);
  assert.match(first.svg, /<use/);
  assert.match(first.svg, /<desc[^>]*>Two functors/);
  assert.doesNotMatch(first.svg, /<image|<text|<script/);
  const ids = [...first.svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of first.svg.matchAll(/(?:href="#|url\(#)([^"\)]+)/g)) assert.ok(ids.includes(reference[1]));
  const second = await compileDiagram(options);
  assert.equal(second.cacheHit, true);
  assert.equal(second.svg, first.svg);
  await rm(directory, { recursive: true });
  const rebuilt = await compileDiagram(options);
  assert.equal(rebuilt.cacheHit, false);
  assert.equal(rebuilt.hash, first.hash);
  assert.equal(rebuilt.svg, first.svg);
});

test('native failures identify the source and compiler error and reject multiple pictures', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'diagram-failure-'));
  try {
    await assert.rejects(compileDiagram({ source: await fixture('invalid'), description: 'Invalid arrow fixture', id: 'invalid', sourcePath: 'posts/broken/diagram.tex', cacheDir: directory }), /posts\/broken\/diagram\.tex:.*native TikZ-CD compilation failed[\s\S]*Undefined control sequence/);
    if (process.platform !== 'win32') {
      await assert.rejects(compileDiagram({ source: await fixture('forbidden-read'), description: 'Rejected external file read', id: 'forbidden', sourcePath: 'tests/fixtures/diagrams/forbidden-read.tex', cacheDir: directory }), /native TikZ-CD compilation failed[\s\S]*(Not reading from|not found)/);
    }
    await assert.rejects(compileDiagram({ source: `${await fixture('arrows')}\n${await fixture('arrows')}`, description: 'Two pictures in one block', id: 'multiple', sourcePath: 'posts/multiple.md', cacheDir: directory }), /exactly one TeX picture/);
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
