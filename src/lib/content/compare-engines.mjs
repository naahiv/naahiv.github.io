/**
 * Reproducible development-only comparison. This never feeds production output.
 * Run from the repository root: node src/lib/content/compare-engines.mjs
 * Native TeX must be on PATH, as for the ordinary article build.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import { load as loadYaml, JSON_SCHEMA } from 'js-yaml';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import MathJax from '@mathjax/src';
import { compilePosts } from './compile.mjs';
import { createMathContext } from './macros.mjs';
import { workDirectory } from '../../../scripts/work-directory.mjs';

const outputDir = path.join(workDirectory, 'engine-comparison');
await fs.mkdir(outputDir, { recursive: true });
const slug = 'mathematical-writing-specimen';
const source = await fs.readFile(`src/content/posts/${slug}.md`, 'utf8');
const parsed = matter(source, { engines: { yaml: (value) => loadYaml(value, { schema: JSON_SCHEMA }) } });
const shared = await fs.readFile('src/data/math-macros.tex', 'utf8');
const posts = await compilePosts({ includeDrafts: true, staticDir: path.join(outputDir, 'public') });
const post = posts.find((item) => item.slug === slug);
if (!post) throw new Error('Missing complete article specimen');
const parse = (html) => new DOMParser().parseFromString(html, 'text/html');
const doc = parse(`<article>${post.html}</article>`);
const elements = Array.from(doc.getElementsByTagName('span'));
const classHas = (node, value) => (` ${node?.getAttribute?.('class') || ''} `).includes(` ${value} `);
const formulas = elements.filter((node) => classHas(node, 'katex')).map((node) => {
  const annotation = node.getElementsByTagName('annotation')[0];
  if (!annotation) throw new Error('KaTeX output is missing original TeX annotation');
  return { node, tex: annotation.textContent, display: classHas(node.parentNode, 'katex-display') };
});
const corpus = formulas.map(({ tex, display }) => ({ tex, display }));
await fs.writeFile(path.join(outputDir, 'corpus.json'), `${JSON.stringify(corpus, null, 2)}\n`);

const initStart = performance.now();
await MathJax.init({
  loader: { load: ['input/tex', 'output/svg', 'a11y/assistive-mml', '[tex]/amscd', '[tex]/mathtools'] },
  tex: { packages: { '[+]': ['amscd', 'mathtools'] } },
  svg: { fontCache: 'none' },
});
await MathJax.tex2svgPromise(`${shared}\n${parsed.data.macros || ''}`, { display: false });
const mathjaxSetupMs = performance.now() - initStart;
const katexStart = performance.now();
const context = createMathContext(shared, parsed.data.macros, post.sourcePath);
const katexSetupMs = performance.now() - katexStart;
const adaptor = MathJax.startup.adaptor;
const engines = {
  katex: { version: JSON.parse(await fs.readFile('node_modules/katex/package.json')).version, setupMs: katexSetupMs, render: ({ tex, display }) => context.render(tex, display) },
  mathjax: { version: JSON.parse(await fs.readFile('node_modules/@mathjax/src/package.json')).version, setupMs: mathjaxSetupMs, render: async ({ tex, display }) => adaptor.outerHTML(await MathJax.tex2svgPromise(tex, { display })) },
};
const metrics = {
  source: post.sourcePath,
  sourceSha256: createHash('sha256').update(source).digest('hex'),
  formulas: corpus.length,
  inline: corpus.filter((item) => !item.display).length,
  display: corpus.filter((item) => item.display).length,
  method: 'Complete rendered article corpus, including headings, captions, footnotes and repeated formulas. Document references are resolved identically upstream. The original native TikZ-CD SVGs and prose are identical. Three warm in-process sequential passes; medians exclude module import, engine initialization, shared/post macro setup, Markdown/reference processing, native TeX and file I/O. Sizes are formula markup only, excluding CSS/fonts. These are local observations, not a general benchmark.',
  engines: {},
};
const outputs = {};
for (const [name, engine] of Object.entries(engines)) {
  const timings = [];
  const errors = [];
  let rendered;
  for (let pass = -1; pass < 3; pass += 1) {
    const start = performance.now();
    rendered = [];
    for (const [index, formula] of corpus.entries()) {
      try {
        const html = await engine.render(formula);
        if (html.includes('data-mml-node="merror"') || html.includes('<merror') || html.includes('katex-error')) throw new Error('Renderer emitted error markup');
        rendered.push(html);
      } catch (error) {
        if (pass === 0) errors.push({ index, tex: formula.tex, message: error.message });
        rendered.push(`<strong>Rendering failed at formula ${index + 1}</strong>`);
      }
    }
    if (pass >= 0) timings.push(performance.now() - start);
  }
  outputs[name] = rendered;
  const markup = rendered.join('\n');
  metrics.engines[name] = {
    version: engine.version, success: corpus.length - errors.length, errors,
    setupMs: Number(engine.setupMs.toFixed(2)),
    medianWarmRenderMs: Number([...timings].sort((a, b) => a - b)[1].toFixed(2)),
    threePassesMs: timings.map((n) => Number(n.toFixed(2))),
    formulaMarkupBytes: Buffer.byteLength(markup), formulaMarkupGzipBytes: gzipSync(markup).length,
    mathmlExpressions: (markup.match(/<math[ >]/g) || []).length,
    svgElements: (markup.match(/<svg[ >]/g) || []).length,
  };
}

await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });
await fs.cp('node_modules/katex/dist/fonts', path.join(outputDir, 'assets/fonts'), { recursive: true });
await fs.copyFile('node_modules/katex/dist/katex.min.css', path.join(outputDir, 'assets/katex.css'));
const fonts = [
  ['Source Serif 4', '@fontsource/source-serif-4', 'source-serif-4-latin-400-normal.woff2', 400],
  ['Source Serif 4', '@fontsource/source-serif-4', 'source-serif-4-latin-400-italic.woff2', 400, 'italic'],
  ['Source Serif 4', '@fontsource/source-serif-4', 'source-serif-4-latin-600-normal.woff2', 600],
  ['Inter', '@fontsource/inter', 'inter-latin-400-normal.woff2', 400],
  ['Inter', '@fontsource/inter', 'inter-latin-500-normal.woff2', 500],
  ['Inter', '@fontsource/inter', 'inter-latin-600-normal.woff2', 600],
];
let fontCss = '';
for (const [family, pkg, file, weight, style = 'normal'] of fonts) {
  await fs.copyFile(`node_modules/${pkg}/files/${file}`, path.join(outputDir, 'assets', file));
  fontCss += `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;src:url('assets/${file}') format('woff2')}\n`;
}
// The production @font-face imports are resolved by Vite. This standalone page
// uses its own copied fonts, so remove those build-only URLs rather than hiding
// failed font requests behind a later declaration.
const globalCss = (await fs.readFile('src/styles/global.css', 'utf8')).replace(/@font-face\s*\{[^}]*\}/g, '');
const mathjaxCss = adaptor.outerHTML(MathJax.startup.document.outputJax.styleSheet(MathJax.startup.document));
const assistiveCss = `mjx-assistive-mml{position:absolute!important;top:0;left:0;clip:rect(1px,1px,1px,1px);padding:1px 0 0 0!important;border:0!important;display:block!important;width:auto!important;overflow:hidden!important;user-select:none!important}mjx-container{position:relative}mjx-container svg{max-width:none}mjx-container[display='true']{margin:0!important}.comparison-nav{padding:24px 0;font:14px Inter,sans-serif}.comparison-nav a{margin-right:20px}`;
const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
for (const [name, rendered] of Object.entries(outputs)) {
  const clone = parse(`<article>${post.html}</article>`);
  const targets = Array.from(clone.getElementsByTagName('span')).filter((node) => classHas(node, 'katex'));
  targets.forEach((node, index) => {
    const fragment = parse(`<div>${rendered[index]}</div>`).documentElement;
    const parent = classHas(node.parentNode, 'katex-display') ? node.parentNode : node;
    const replacement = fragment.firstChild;
    parent.parentNode.replaceChild(clone.importNode(replacement, true), parent);
  });
  const body = Array.from(clone.documentElement.childNodes).map((node) => new XMLSerializer().serializeToString(node)).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} — same complete article</title><link rel="stylesheet" href="assets/katex.css"><style>${fontCss}${globalCss}${assistiveCss}</style>${name === 'mathjax' ? mathjaxCss : ''}</head><body><main class="shell article-shell"><nav class="comparison-nav" aria-label="Equation engine comparison"><a href="katex.html">KaTeX ${engines.katex.version}</a><a href="mathjax.html">MathJax ${engines.mathjax.version}</a><a href="metrics.json">Measurements</a></nav><header class="article-header"><p class="eyebrow">Development comparison · ${name}</p><h1>${escape(post.title)}</h1><p class="article-deck">Same complete article, shared notation, native diagrams, and reading layout. Only the ordinary equation renderer changes.</p></header><article class="prose">${body}</article></main></body></html>`;
  await fs.writeFile(path.join(outputDir, `${name}.html`), html);
}
await fs.writeFile(path.join(outputDir, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);
console.log(JSON.stringify(metrics, null, 2));
if (Object.values(metrics.engines).some((engine) => engine.errors.length)) process.exitCode = 1;
