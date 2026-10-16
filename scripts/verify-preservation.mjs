import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readAssetManifest, repositoryRoot } from './stage-assets.mjs';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const noteKinds = new Set(['note', 'notes', 'survey']);

/** Current-content checks remain valid after an authorized PDF or portfolio update. */
export function validatePortfolio(records, manifest) {
  assert.ok(Array.isArray(records), 'src/data/portfolio.json must be an array.');
  const titles = new Set();
  for (const [index, record] of records.entries()) {
    const location = `src/data/portfolio.json record ${index + 1}`;
    for (const field of ['title', 'kind', 'status', 'description']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim(), `${location}: missing ${field}.`);
    }
    assert.ok(!titles.has(record.title), `${location}: duplicate title ${record.title}.`);
    titles.add(record.title);
    assert.ok(Number.isInteger(record.year) && record.year > 0, `${location}: year must be a positive integer.`);
    assert.ok(Number.isInteger(record.pages) && record.pages > 0, `${location}: pages must be a positive integer.`);
    const category = noteKinds.has(record.kind) ? 'note' : record.kind;
    assert.ok(['note', 'paper', 'project'].includes(category), `${location}: unsupported kind ${record.kind}.`);
    assert.equal(record.category, category, `${location}: category must normalize note/notes/survey to note.`);
    if (record.venue !== undefined) assert.equal(typeof record.venue, 'string', `${location}: venue must be text.`);
    assert.ok(Array.isArray(record.links), `${location}: links must be an array, including when empty.`);
    for (const link of record.links) {
      assert.ok(typeof link.label === 'string' && link.label.trim(), `${location}: link label is required.`);
      assert.ok(typeof link.href === 'string' && link.href, `${location}: link href is required.`);
      if (/^https?:\/\//.test(link.href)) {
        assert.equal(link.external, true, `${location}: external link must set external: true.`);
        assert.ok(new URL(link.href).hostname, `${location}: external URL is invalid.`);
      } else {
        assert.ok(!link.external, `${location}: local asset must not be marked external.`);
        assert.ok(manifest.includes(link.href.replace(/^\//, '')), `${location}: ${link.href} is not in the public asset manifest.`);
      }
    }
  }
  return records;
}

/** Baseline comparison is opt-in: a release migration certificate, not a future golden file. */
export async function verifyPreservation({ rootDir = repositoryRoot, outputDir = join(rootDir, 'dist'), baseline = false } = {}) {
  const manifest = await readAssetManifest(rootDir);
  const records = validatePortfolio(JSON.parse(await readFile(join(rootDir, 'src/data/portfolio.json'), 'utf8')), manifest);
  const frozen = baseline ? JSON.parse(await readFile(join(rootDir, 'docs/baseline.json'), 'utf8')) : null;
  if (frozen) {
    assert.deepEqual(manifest, frozen.assets.map((item) => item.path), 'Public asset manifest differs from the migration baseline.');
    assert.deepEqual(records.map(({ category, ...original }) => original), frozen.portfolio,
      'Portfolio fields or intentional record/link order differ from the migration baseline.');
  }
  const assets = [];
  for (const filename of manifest) {
    const source = await readFile(join(rootDir, filename));
    let output;
    try {
      output = await readFile(join(outputDir, filename));
    } catch (cause) {
      throw new Error(`Missing served asset ${filename} in ${outputDir}; run the asset staging/build step.`, { cause });
    }
    const sourceHash = sha256(source);
    assert.equal(sha256(output), sourceHash, `Served /${filename} does not match its current canonical source.`);
    if (frozen) {
      const original = frozen.assets.find((asset) => asset.path === filename);
      assert.equal(sourceHash, original.sha256, `Canonical ${filename} differs from the frozen migration baseline.`);
      assert.equal(source.length, original.bytes, `Canonical ${filename} byte length differs from the frozen migration baseline.`);
    }
    assets.push({ path: `/${filename}`, bytes: source.length, sha256: sourceHash });
  }
  return { records: records.length, pdfs: manifest.filter((filename) => filename.endsWith('.pdf')).length, assets, baseline };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const rootArg = process.argv.find((arg) => arg.startsWith('--root='));
  const dirArg = process.argv.find((arg) => arg.startsWith('--dir='));
  const result = await verifyPreservation({
    baseline: process.argv.includes('--baseline'),
    ...(rootArg ? { rootDir: resolve(rootArg.slice(7)) } : {}),
    ...(dirArg ? { outputDir: resolve(dirArg.slice(6)) } : {}),
  });
  console.log(`Verified ${result.records} portfolio records and ${result.assets.length} unchanged served assets (${result.pdfs} PDFs)${result.baseline ? ' against the frozen migration baseline' : ' against current canonical sources'}.`);
}
