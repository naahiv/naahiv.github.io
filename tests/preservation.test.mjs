import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { readAssetManifest, repositoryRoot, stageAssets } from '../scripts/stage-assets.mjs';
import { sha256, validatePortfolio, verifyPreservation } from '../scripts/verify-preservation.mjs';

async function fixture(t, { currentBaseline = false } = {}) {
  const rootDir = await mkdtemp(join(tmpdir(), 'portfolio-preservation-'));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  await mkdir(join(rootDir, 'src/data'), { recursive: true });
  await mkdir(join(rootDir, 'docs'), { recursive: true });
  const files = ['src/data/portfolio.json', 'src/data/legacy-assets.json', 'docs/baseline.json', ...await readAssetManifest()];
  for (const file of files) await copyFile(join(repositoryRoot, file), join(rootDir, file));
  if (currentBaseline) {
    const baseline = JSON.parse(await readFile(join(rootDir, 'docs/baseline.json'), 'utf8'));
    baseline.portfolio = JSON.parse(await readFile(join(rootDir, 'src/data/portfolio.json'), 'utf8')).map(({ category, ...record }) => record);
    baseline.assets = await Promise.all((await readAssetManifest(rootDir)).map(async (path) => {
      const bytes = await readFile(join(rootDir, path));
      return { path, bytes: bytes.length, sha256: sha256(bytes) };
    }));
    await writeFile(join(rootDir, 'docs/baseline.json'), JSON.stringify(baseline));
  }
  return { rootDir, files, outputDir: join(rootDir, '.generated/public') };
}

test('migration retains all metadata, record/link order, 17 PDF bytes, portrait, and TeX asset', { skip: process.env.MIGRATION_BASELINE !== '1' }, async (t) => {
  const paths = await fixture(t);
  await stageAssets(paths);
  const result = await verifyPreservation({ ...paths, baseline: true });
  assert.equal(result.records, 18);
  assert.equal(result.pdfs, 17);
  assert.equal(result.assets.length, 19);
  assert.equal(result.assets.filter((item) => item.path.endsWith('.pdf')).reduce((total, item) => total + item.bytes, 0), 10727259);
  const records = JSON.parse(await readFile(join(paths.rootDir, 'src/data/portfolio.json'), 'utf8'));
  assert.equal(records.filter((record) => record.category === 'note').length, 14);
  assert.deepEqual(records[0].links, []);
  assert.deepEqual(records[1].links.map((link) => link.label), ['PDF', 'Book PDF']);
});

test('current portfolio and staged assets agree without imposing frozen migration hashes', async (t) => {
  const paths = await fixture(t);
  await stageAssets(paths);
  const result = await verifyPreservation(paths);
  assert.ok(result.records > 0);
  assert.equal(result.assets.length, (await readAssetManifest(paths.rootDir)).length);
});

test('staging preserves compiler assets and only copies the explicit public allowlist', async (t) => {
  const paths = await fixture(t);
  await mkdir(join(paths.outputDir, 'diagrams'), { recursive: true });
  await writeFile(join(paths.outputDir, 'diagrams/compiled.svg'), '<svg/>');
  await writeFile(join(paths.rootDir, 'private-local-note.txt'), 'must not be copied');
  await stageAssets(paths);
  assert.equal(await readFile(join(paths.outputDir, 'diagrams/compiled.svg'), 'utf8'), '<svg/>');
  await assert.rejects(readFile(join(paths.outputDir, 'private-local-note.txt')), { code: 'ENOENT' });
});

test('ongoing validation catches stale served assets and missing canonical files', async (t) => {
  const paths = await fixture(t);
  await stageAssets(paths);
  await writeFile(join(paths.outputDir, 'derived-cats-in-ag.pdf'), 'stale output');
  await assert.rejects(verifyPreservation(paths), /does not match its current canonical source/);
  await rm(join(paths.rootDir, 'derived-cats-in-ag.pdf'));
  await assert.rejects(stageAssets(paths), /Cannot stage canonical public asset derived-cats-in-ag.pdf/);
});

test('migration comparison detects changed fields and reordered records', async (t) => {
  const paths = await fixture(t, { currentBaseline: true });
  await stageAssets(paths);
  const metadataPath = join(paths.rootDir, 'src/data/portfolio.json');
  const records = JSON.parse(await readFile(metadataPath, 'utf8'));
  records[1].description += ' Changed';
  await writeFile(metadataPath, JSON.stringify(records));
  await assert.rejects(verifyPreservation({ ...paths, baseline: true }), /Portfolio fields or intentional record\/link order/);
  const original = JSON.parse(await readFile(join(repositoryRoot, 'src/data/portfolio.json'), 'utf8'));
  [original[0], original[1]] = [original[1], original[0]];
  await writeFile(metadataPath, JSON.stringify(original));
  await assert.rejects(verifyPreservation({ ...paths, baseline: true }), /Portfolio fields or intentional record\/link order/);
});

test('a PDF refresh changes only its canonical PDF and the single metadata file', async (t) => {
  const paths = await fixture(t);
  const before = new Map(await Promise.all(paths.files.map(async (file) => [file, sha256(await readFile(join(paths.rootDir, file)))])));
  const metadataPath = join(paths.rootDir, 'src/data/portfolio.json');
  const records = JSON.parse(await readFile(metadataPath, 'utf8'));
  const linked = records.filter((record) => record.links.some((link) => link.href === 'derived-cats-in-ag.pdf'));
  assert.equal(linked.length, 1, 'The publisher must find exactly one authoritative metadata record.');
  // Use another known valid repository PDF in a disposable fixture; no original PDF is touched.
  const substitute = records.find((record) => record.links.some((link) => link.href === 'galois-theory.pdf'));
  await copyFile(join(paths.rootDir, 'galois-theory.pdf'), join(paths.rootDir, 'derived-cats-in-ag.pdf'));
  linked[0].pages = substitute.pages;
  assert.ok(linked[0].pages > 0);
  await writeFile(metadataPath, JSON.stringify(records, null, 2) + '\n');
  await stageAssets(paths);
  await verifyPreservation(paths); // No obsolete baseline hash rejects an ordinary refresh.
  await assert.rejects(verifyPreservation({ ...paths, baseline: true }), /migration baseline/);
  const changed = [];
  for (const file of paths.files) if (sha256(await readFile(join(paths.rootDir, file))) !== before.get(file)) changed.push(file);
  assert.deepEqual(changed.sort(), ['derived-cats-in-ag.pdf', 'src/data/portfolio.json']);
  assert.equal(sha256(await readFile(join(paths.outputDir, 'derived-cats-in-ag.pdf'))), sha256(await readFile(join(paths.rootDir, 'galois-theory.pdf'))));
});

test('validation rejects missing linked assets, invalid page counts, and unsafe manifest paths', async (t) => {
  const paths = await fixture(t);
  const records = JSON.parse(await readFile(join(paths.rootDir, 'src/data/portfolio.json'), 'utf8'));
  const manifest = await readAssetManifest(paths.rootDir);
  records[0].pages = 0;
  assert.throws(() => validatePortfolio(records, manifest), /pages must be a positive integer/);
  records[0].pages = 120;
  records[1].links[0].href = 'missing.pdf';
  assert.throws(() => validatePortfolio(records, manifest), /not in the public asset manifest/);
  await writeFile(join(paths.rootDir, 'src/data/legacy-assets.json'), JSON.stringify(['../private.txt']));
  await assert.rejects(stageAssets(paths), /Unsafe asset path/);
});
