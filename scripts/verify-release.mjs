import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { readAssetManifest } from './stage-assets.mjs';
import { sha256, verifyPreservation } from './verify-preservation.mjs';
import { externalWorkDirectory } from './work-directory.mjs';

const execute = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const slug = 'release-verification-fixture';
const title = 'Evaluation at one: release verification';
const summary = 'A temporary integration fixture for the first published mathematics post.';
const canonical = `https://naahiv.github.io/blog/${slug}/`;
const initialDrafts = ['mathematical-writing-specimen', 'a-small-pullback'];

async function filesIn(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? filesIn(path.join(directory, entry.name), `${prefix}${entry.name}/`)
    : [`${prefix}${entry.name}`]));
  return nested.flat();
}

/** Exercise first-publication behavior without publishing or touching any real source/output. */
export async function verifyRelease({ rootDir = repositoryRoot } = {}) {
  const started = performance.now();
  const workDir = externalWorkDirectory(rootDir);
  await mkdir(workDir, { recursive: true });
  const temporary = await mkdtemp(path.join(workDir, 'release-check-'));
  let success = false;
  const log = [];
  const env = { ...process.env, INCLUDE_DRAFTS: 'false', ASTRO_TELEMETRY_DISABLED: '1' };
  const run = async (args) => {
    try {
      const result = await execute(process.execPath, args, { cwd: temporary, env, timeout: 180_000, maxBuffer: 8 * 1024 * 1024 });
      log.push(`$ node ${args.join(' ')}\n${result.stdout}${result.stderr}`);
      return result;
    } catch (error) {
      log.push(`$ node ${args.join(' ')}\n${error.stdout ?? ''}${error.stderr ?? ''}`);
      throw new Error(`Isolated release check failed while running ${args[0]}: ${error.message}`, { cause: error });
    }
  };

  try {
    const manifest = await readAssetManifest(rootDir);
    const sources = ['src', 'scripts', 'templates', 'package.json', 'package-lock.json', 'astro.config.mjs', ...manifest];
    for (const source of sources) await cp(path.join(rootDir, source), path.join(temporary, source), { recursive: true });
    for (const optional of ['tsconfig.json', '.nvmrc']) {
      if (await stat(path.join(rootDir, optional)).catch(() => null)) await cp(path.join(rootDir, optional), path.join(temporary, optional));
    }
    // Dependencies are reused read-only; every source, cache, staged asset, and build output is isolated.
    await symlink(path.join(rootDir, 'node_modules'), path.join(temporary, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
    await run(['scripts/new-post.mjs', slug, '--title', title, '--date', '2026-10-16']);
    const postDirectory = path.join(temporary, 'src/content/posts', slug);
    const postPath = path.join(postDirectory, 'index.md');
    const generated = await readFile(postPath, 'utf8');
    assert.ok(!generated.includes('{{'), 'The new-post command must replace every starter placeholder.');
    assert.match(generated, /^draft: true$/m, 'The starter must create a draft by default.');
    assert.match(generated, /```tikzcd/, 'The actual starter must exercise native TikZ-CD.');
    const published = generated
      .replace(/^draft: true$/m, 'draft: false')
      .replace(/^summary: .+$/m, `summary: ${JSON.stringify(summary)}`)
      .replace(/^tags: \[algebra\]$/m, 'tags: [algebra, release-verification]')
      .replace('This is an instructional draft, not a finished post. Replace the example with\nyour own exposition before changing `draft` to `false`.',
        'This temporary test article exercises the first publication workflow in an isolated build. It is never added to the real website.')
      + '\n![A blue square used to verify a post-local image asset.](fixture-illustration.svg)\n';
    assert.match(published, /^draft: false$/m);
    assert.ok(!/^specimen: true$/m.test(published), 'The publication fixture must not bypass specimen rules.');
    await writeFile(postPath, published);
    const illustration = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>Release fixture illustration</title><rect x="4" y="4" width="40" height="40" fill="#254c78"/></svg>\n';
    await writeFile(path.join(postDirectory, 'fixture-illustration.svg'), illustration);

    // These are the same two operations as npm run build, with no old generated files/cache.
    await run(['scripts/prepare.mjs']);
    await run(['node_modules/astro/bin/astro.mjs', 'build']);
    const outputDir = path.join(temporary, 'dist');
    const readOutput = (filename) => readFile(path.join(outputDir, filename), 'utf8');
    const article = await readOutput(`blog/${slug}/index.html`);
    assert.ok(article.includes(title), 'The actual post route must contain its title.');
    assert.ok(article.includes(`rel="canonical" href="${canonical}"`), 'The article canonical must use its stable domain-root URL.');
    assert.ok(!article.includes('noindex, nofollow'), 'A published post must not inherit the draft robots directive.');
    for (const target of ['lem:evaluation', 'eq:evaluation', 'diag:naturality']) {
      assert.ok(article.includes(`id="${target}"`), `Missing rendered target ${target}.`);
      assert.ok(article.includes(`href="#${target}"`), `Missing rendered reference to ${target}.`);
    }
    assert.match(article, /<math[\s>]/, 'Published article mathematics must include MathML.');
    assert.match(article, /<svg[^>]*role="img"/, 'The starter must compile genuine TikZ-CD into accessible SVG.');
    assert.match(article, /<desc[\s>]/, 'Native diagrams must retain their authored description.');
    assert.ok(article.includes(`/post-assets/${slug}/fixture-illustration.svg`), 'The local image URL must point to its generated public asset.');
    const copiedAsset = await readFile(path.join(outputDir, 'post-assets', slug, 'fixture-illustration.svg'));
    assert.equal(sha256(copiedAsset), sha256(illustration), 'The post-local image must be copied byte-for-byte.');

    const listings = ['blog/index.html', 'blog/archive/index.html', 'blog/tags/algebra/index.html', 'blog/tags/release-verification/index.html'];
    for (const filename of listings) {
      const html = await readOutput(filename);
      assert.ok(html.includes(`/blog/${slug}/`), `${filename} must link to the published post.`);
      assert.ok(html.includes(title), `${filename} must include the post title.`);
    }
    const rss = await readOutput('rss.xml');
    assert.ok(rss.includes(`<link>${canonical}</link>`), 'RSS must include the canonical post link.');
    assert.ok(rss.includes(summary), 'RSS must include its readable summary.');
    assert.ok(!rss.includes('katex') && !rss.includes('<math'), 'RSS summaries must exclude renderer internals.');
    const sitemap = await readOutput('sitemap.xml');
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), 'Sitemap must include the canonical post route.');
    assert.ok(sitemap.includes('/blog/tags/release-verification/'), 'Sitemap must include the published topic route.');
    const search = JSON.parse(await readOutput('search.json'));
    const indexed = search.find((entry) => entry.slug === slug);
    assert.ok(indexed, 'Search must include the first published post.');
    assert.equal(indexed.title, title);
    assert.equal(indexed.summary, summary);
    assert.ok(indexed.tags.includes('release-verification'));
    assert.match(indexed.text, /homomorphism/);
    assert.ok(!indexed.text.includes('katex') && !indexed.text.includes('<math'), 'Search prose must exclude renderer internals.');

    const outputFiles = await filesIn(outputDir);
    const publicText = [article, rss, sitemap, JSON.stringify(search), ...await Promise.all(listings.map(readOutput))].join('\n');
    for (const draft of initialDrafts) {
      assert.ok(!outputFiles.some((file) => file.includes(draft)), `Draft ${draft} leaked a route or public asset.`);
      assert.ok(!publicText.includes(draft), `Draft ${draft} leaked into public content/indexes.`);
    }
    for (const filename of outputFiles) {
      assert.ok(!/^(?:src|scripts|docs|tests|templates|node_modules|\.git|\.cache|\.astro)\//.test(filename), `Source-only path was published: ${filename}`);
      assert.ok(!/^(?:package(?:-lock)?\.json|astro\.config\.mjs|tsconfig\.json|\.env(?:\..*)?)$/.test(filename), `Root configuration was published: ${filename}`);
    }
    const preservation = await verifyPreservation({ rootDir: temporary, outputDir });
    const result = {
      publishedFixture: slug,
      checks: ['actual starter command', 'clean production Astro build', 'theorem/equation/diagram references', 'native TikZ-CD', 'canonical URL', 'topic and archive routes', 'RSS', 'search', 'sitemap', 'post-local SVG bytes', 'draft and source exclusions', 'canonical legacy asset preservation'],
      portfolioRecords: preservation.records,
      preservedAssets: preservation.assets.length,
      seconds: Number(((performance.now() - started) / 1000).toFixed(2)),
    };
    await writeFile(path.join(workDir, 'release-verification.json'), `${JSON.stringify(result, null, 2)}\n`);
    success = true;
    return result;
  } catch (error) {
    await writeFile(path.join(temporary, 'verification.log'), `${log.join('\n')}\n${error.stack}\n`);
    throw new Error(`${error.message}\nThe isolated failing fixture and log remain at ${temporary}; the real sources/output were not changed.`, { cause: error });
  } finally {
    if (success) await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = await verifyRelease();
  console.log(`First-publication check passed: ${result.checks.length} integration checks, ${result.portfolioRecords} portfolio records, ${result.preservedAssets} unchanged assets (${result.seconds}s). Temporary fixture removed; production sources unchanged.`);
}
