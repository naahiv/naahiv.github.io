import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { load as loadYaml, JSON_SCHEMA } from 'js-yaml';
import { z } from 'zod';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit, SKIP } from 'unist-util-visit';
import { createMathContext, plainMath, plainTitle } from './macros.mjs';
import { ReferenceRegistry, extractMathLabel, resolveMathReferences, fail } from './references.mjs';
import { readAssetManifest } from '../../../scripts/stage-assets.mjs';

const date = z.union([z.string(), z.date()]).transform((value) => value instanceof Date ? value.toISOString().slice(0, 10) : value)
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, 'Use a real date in YYYY-MM-DD format');
export const postSchema = z.object({
  title: z.string().min(1).max(180), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine((value) => !['archive', 'tags', 'index'].includes(value), 'This slug is reserved for blog navigation'), date,
  updated: date.optional(), summary: z.string().min(1).max(600),
  tags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
  draft: z.boolean().default(true), specimen: z.boolean().default(false),
  series: z.object({ name: z.string().min(1), order: z.number().int().positive() }).strict().optional(),
  macros: z.string().default(''),
}).strict().refine((data) => !data.specimen || data.draft, { message: 'Development specimens must remain drafts', path: ['draft'] });

const theoremNames = Object.fromEntries(['theorem', 'lemma', 'proposition', 'corollary', 'definition', 'remark', 'example', 'question', 'proof'].map((name) => [name, name[0].toUpperCase() + name.slice(1)]));
const parser = unified().use(remarkParse).use(remarkMath).use(remarkDirective).use(remarkGfm);
const element = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });
const raw = (value) => ({ type: 'raw', value });
const referenceAnchor = (reference, label = reference.text) => element('a', { href: reference.href, className: ['math-reference'], 'data-reference-kind': reference.kind }, [text(label)]);
function formulaReferenceLinks(node) {
  const references = [...new Map((node.mathReferences || []).map((reference) => [reference.href, reference])).values()];
  return references.length ? [element('span', { className: ['formula-reference-links'] }, [text(' (see '), ...references.flatMap((reference, index) => [...(index ? [text(', ')] : []), referenceAnchor(reference)]), text(')')])] : [];
}
const assetExtensions = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.pdf', '.tex']);

async function markdownFiles(directory) {
  let entries;
  try { entries = await fs.readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? markdownFiles(path.join(directory, entry.name)) : entry.isFile() && entry.name.endsWith('.md') ? [path.join(directory, entry.name)] : []));
  return nested.flat().sort();
}

function nodeText(node) {
  if (node.reference) return node.reference.text;
  if (node.type === 'inlineMath' || node.type === 'math') return plainMath(node.value);
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  if (node.type === 'image') return node.alt || '';
  if (node.type === 'code') return node.lang === 'tikzcd' ? (node.diagram?.description || '') : '';
  return node.children?.map(nodeText).join(node.type === 'root' ? '\n' : '') || '';
}

function slugify(value) {
  return value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
}

function parseDiagramMeta(node, post) {
  const input = (node.meta || '').trim().replace(/^\{(.*)\}$/, '$1');
  const attributes = {};
  let remainder = input;
  while (remainder.trim()) {
    remainder = remainder.trimStart();
    const id = remainder.match(/^#([A-Za-z][A-Za-z0-9_.:-]*)(?:\s|$)/);
    if (id) { attributes.id = id[1]; remainder = remainder.slice(id[0].length); continue; }
    const attribute = remainder.match(/^(caption|description)=(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')(?=\s|$)/);
    if (!attribute) fail(post, node, 'TikZ-CD fence attributes must be {#stable-id caption="Optional caption" description="Objects, arrows, and commutativity"}');
    attributes[attribute[1]] = (attribute[2] ?? attribute[3]).replace(/\\(["'\\])/g, '$1');
    remainder = remainder.slice(attribute[0].length);
  }
  if (!attributes.id || !attributes.description?.trim()) fail(post, node, 'TikZ-CD requires a stable #id and an authored description');
  return attributes;
}

/** First pass: collect semantic targets without resolving any references. */
export function collectPostStructure(post, registry) {
  let theoremNumber = 0;
  let equationNumber = 0;
  let diagramNumber = 0;
  post.headings = [];
  visit(post.tree, (node) => {
    if (node.type === 'heading') {
      let id;
      const last = node.children.at(-1);
      const explicit = last?.type === 'text' && last.value.match(/\s*\{#([A-Za-z][A-Za-z0-9_.:-]*)\}\s*$/);
      if (explicit) { id = explicit[1]; last.value = last.value.slice(0, explicit.index); }
      const title = nodeText(node).trim();
      id ||= slugify(title);
      registry.addLabel(post, id, { kind: 'section', text: title }, node);
      node.data = { ...node.data, hProperties: { id } };
      post.headings.push({ depth: node.depth, id, text: title });
    }
    if (node.type === 'containerDirective') {
      if (!(node.name in theoremNames)) fail(post, node, `Unknown block "${node.name}"; supported blocks: ${Object.keys(theoremNames).join(', ')}`);
      const titleNode = node.children.find((child) => child.data?.directiveLabel);
      node.titleChildren = titleNode?.children || [];
      node.children = node.children.filter((child) => !child.data?.directiveLabel);
      const unnumbered = node.name === 'proof' || Object.hasOwn(node.attributes || {}, 'unnumbered');
      const number = unnumbered ? undefined : ++theoremNumber;
      const label = `${theoremNames[node.name]}${number ? ` ${number}` : ''}`;
      node.block = { label, number, id: node.attributes?.id, title: nodeText(titleNode || {}).trim(), kind: node.name };
      if (node.block.id) registry.addLabel(post, node.block.id, { kind: node.name, text: number ? label : node.block.title || label, number }, node);
    }
    if (node.type === 'math' || node.type === 'inlineMath') {
      const { id, tex } = extractMathLabel(node.value, post, node);
      node.value = tex;
      if (id) {
        const number = ++equationNumber;
        registry.addLabel(post, id, { kind: 'equation', text: `Equation (${number})`, number }, node);
        node.equation = { id, number };
      }
    }
    if (node.type === 'code' && node.lang === 'tikzcd') {
      node.diagram = { ...parseDiagramMeta(node, post), number: ++diagramNumber };
      if (node.diagram.caption) {
        const captionTree = parser.parse(node.diagram.caption);
        if (captionTree.children.length !== 1 || captionTree.children[0].type !== 'paragraph') fail(post, node, 'A diagram caption must be a single paragraph of inline Markdown');
        node.diagram.captionChildren = captionTree.children[0].children;
      }
      registry.addLabel(post, node.diagram.id, { kind: 'diagram', text: `Diagram ${node.diagram.number}`, number: node.diagram.number }, node);
    }
  });
}

// Directive titles and diagram captions are rendered phrasing trees stored
// outside mdast's standard children; their links need the same validation.
function visitRenderedContent(tree, visitor) {
  visit(tree, (node) => {
    visitor(node);
    for (const child of node.titleChildren || []) visitRenderedContent(child, visitor);
    for (const child of node.diagram?.captionChildren || []) visitRenderedContent(child, visitor);
  });
}

async function processAssets(post, staticDir, registry, publicAssets) {
  const tasks = [];
  const usedDefinitions = new Set();
  const seenDefinitions = new Set();
  visitRenderedContent(post.tree, (node) => {
    if (node.type === 'imageReference' || node.type === 'linkReference') usedDefinitions.add(node.identifier.toUpperCase());
  });
  visitRenderedContent(post.tree, (node) => {
    if (node.type !== 'image' && node.type !== 'link' && node.type !== 'definition') return;
    if (node.type === 'definition') {
      const identifier = node.identifier.toUpperCase();
      // CommonMark resolves the first definition. Stale/unused definitions
      // must not cause their files to be copied into the published output.
      if (seenDefinitions.has(identifier)) return;
      seenDefinitions.add(identifier);
      if (!usedDefinitions.has(identifier)) return;
    }
    const url = node.url;
    if (!url || /^(?:https?:|mailto:|tel:)/.test(url)) return;
    if (url.startsWith('#')) { registry.resolve(post, url, node); return; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) fail(post, node, `Unsupported asset/link URL "${url}"`);
    if (url.startsWith('/')) {
      // Routes are validated separately; static root file links must exist canonically.
      const pathname = url.split(/[?#]/)[0];
      if (path.extname(pathname)) {
        if (!publicAssets.has(pathname)) fail(post, node, `Missing root asset or asset outside the explicit public manifest: "${pathname}"`);
        tasks.push(fs.access(path.resolve(process.cwd(), `.${pathname}`)).catch(async () => {
          try { await fs.access(path.join(staticDir, pathname)); }
          catch { fail(post, node, `Missing root asset "${pathname}"`); }
        }));
      } else {
        const fragment = url.includes('#') ? url.slice(url.indexOf('#') + 1) : '';
        const blogTarget = pathname.match(/^\/blog\/([^/]+)\/$/);
        if (blogTarget && !['archive', 'tags'].includes(blogTarget[1])) {
          if (fragment) registry.resolve(post, `${blogTarget[1]}#${fragment}`, node);
          else registry.resolve(post, blogTarget[1], node, { postOnly: true });
        } else if (pathname === '/') {
          if (fragment && !['top', 'work', 'about', 'contact'].includes(fragment)) fail(post, node, `Unknown home-page fragment "${fragment}"`);
        } else if (/^\/blog\/tags\/[^/]+\/$/.test(pathname)) {
          const tag = pathname.split('/')[3];
          if (![...registry.posts.values()].some(({ post: entry }) => entry.tags.includes(tag))) fail(post, node, `Unknown topic route "${pathname}"`);
          if (fragment) fail(post, node, `Fragments on topic routes are unsupported: "${url}"`);
        } else if (!['/papers/', '/blog/', '/blog/archive/'].includes(pathname) || fragment) fail(post, node, `Unknown internal route or fragment "${url}"; post URLs require a trailing slash`);
      }
      return;
    }
    tasks.push((async () => {
      const [pathname] = url.split(/[?#]/);
      let decoded;
      try { decoded = decodeURIComponent(pathname); } catch { fail(post, node, `Malformed asset URL "${url}"`); }
      const extension = path.extname(decoded).toLowerCase();
      if (!assetExtensions.has(extension)) fail(post, node, `Unsupported relative asset "${url}"; use :post[slug] for another post or an absolute /route/`);
      const base = path.dirname(post.sourcePath);
      const absolute = path.resolve(base, decoded);
      if (!absolute.startsWith(`${base}${path.sep}`)) fail(post, node, `Post assets must be inside their post directory: "${url}"`);
      let real;
      try { real = await fs.realpath(absolute); } catch { fail(post, node, `Missing post asset "${url}"`); }
      if (real !== absolute) fail(post, node, `Symlinked post assets are not supported: "${url}"`);
      const relative = path.relative(base, absolute).split(path.sep).join('/');
      const output = path.join(staticDir, 'post-assets', post.slug, relative);
      await fs.mkdir(path.dirname(output), { recursive: true });
      await fs.copyFile(absolute, output);
      node.url = `/post-assets/${post.slug}/${relative.split('/').map(encodeURIComponent).join('/')}${url.slice(pathname.length)}`;
    })());
  });
  await Promise.all(tasks);
}

const handlers = {
  inlineMath(_state, node) {
    if (node.singleReference) return referenceAnchor(node.singleReference, node.singleReference.mathText);
    return node.mathReferences?.length ? element('span', { className: ['inline-formula-with-references'] }, [raw(node.rendered), ...formulaReferenceLinks(node)]) : raw(node.rendered);
  },
  math(_state, node) {
    const scroll = element('div', { className: ['math-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Mathematical expression; scroll horizontally if needed' }, [raw(node.rendered)]);
    const children = [scroll];
    if (node.equation) children.push(element('a', { className: ['equation-number'], href: `#${node.equation.id}`, ariaLabel: `Equation ${node.equation.number}` }, [text(`(${node.equation.number})`)]));
    const display = element('div', { className: ['display-math'], ...(node.equation ? { id: node.equation.id } : {}) }, children);
    return node.mathReferences?.length ? element('div', { className: ['display-with-references'] }, [display, ...formulaReferenceLinks(node)]) : display;
  },
  containerDirective(state, node) {
    const { kind, label, id, title } = node.block;
    const heading = [element('span', { className: ['theorem-label'] }, [text(label)])];
    if (title) heading.push(text(' ('), ...state.all({ children: node.titleChildren }), text(')'));
    heading.push(text('.'));
    if (id) heading.push(element('a', { href: `#${id}`, className: ['block-anchor'], ariaLabel: `Link to ${label}` }, [text('¶')]));
    const children = [element('p', { className: ['theorem-heading'] }, heading), ...state.all(node)];
    if (kind === 'proof') children.push(element('span', { className: ['qed'], ariaLabel: 'End of proof' }, [text('□')]));
    return element('section', { className: ['math-block', `math-block--${kind}`], ...(id ? { id } : {}), ariaLabel: title ? `${label}: ${title}` : label }, children);
  },
  textDirective(_state, node) {
    return referenceAnchor(node.reference);
  },
  code(state, node) {
    if (!node.diagram) return element('pre', {}, [element('code', node.lang ? { className: [`language-${node.lang}`] } : {}, [text(`${node.value}\n`)])]);
    const { id, number, caption, description, svg } = node.diagram;
    return element('figure', { id, className: ['tikz-diagram'] }, [
      element('div', { className: ['diagram-scroll'], tabIndex: 0, role: 'region', ariaLabel: `Diagram ${number}; scroll horizontally if needed` }, [raw(svg)]),
      element('figcaption', {}, [element('span', { className: ['diagram-number'] }, [text(`Diagram ${number}. `)]), ...(caption ? state.all({ children: node.diagram.captionChildren }) : [text(description)])]),
      ...(caption ? [element('p', { className: ['diagram-description'] }, [text(description)])] : []),
      element('details', { className: ['diagram-source'] }, [element('summary', {}, [text('Diagram TeX source')]), element('pre', {}, [element('code', { className: ['language-tex'] }, [text(node.value)])])]),
    ]);
  },
};

async function renderPost(post, registry, sharedSource, staticDir, publicAssets) {
  const context = createMathContext(sharedSource, post.macros, post.sourcePath);
  const diagramTasks = [];
  const processNode = (node) => {
    if (node.type === 'math' || node.type === 'inlineMath') {
      const tex = resolveMathReferences(node.value, post, node, registry);
      if (node.type === 'inlineMath' && /^\s*\\(?:eqref|ref)\s*\{[^{}]+\}\s*$/.test(node.value)) node.singleReference = node.mathReferences[0];
      try { node.rendered = context.render(tex, node.type === 'math'); }
      catch (error) { fail(post, node, `Invalid mathematics: ${error.message}`); }
    }
    if (node.type === 'textDirective') {
      if (!['ref', 'post'].includes(node.name)) fail(post, node, `Unknown inline directive "${node.name}"; use :ref[label] or :post[slug]`);
      // remark-directive parses a colon inside a familiar label (eq:main) as
      // a nested, empty directive. It is literal label syntax in this context.
      const target = node.children.map((child) => child.type === 'text' ? child.value : child.type === 'textDirective' && !child.children.length ? `:${child.name}` : nodeText(child)).join('').trim();
      node.reference = registry.resolve(post, target, node, { postOnly: node.name === 'post' });
      return SKIP;
    }
    if (node.type === 'leafDirective') fail(post, node, 'Leaf directives are unsupported; use :::theorem blocks or :ref[label]');
    if (node.type === 'html') fail(post, node, 'Raw HTML is outside the article profile; use Markdown or a documented mathematical directive');
    if (node.type === 'containerDirective') node.titleChildren.forEach((child) => visit(child, processNode));
    if (node.diagram?.captionChildren) node.diagram.captionChildren.forEach((child) => visit(child, processNode));
    if (node.diagram) diagramTasks.push((async () => {
      const { compileDiagram } = await import('./diagrams.mjs');
      const result = await compileDiagram({ source: node.value, description: node.diagram.description, id: `${post.slug}-${node.diagram.id}`, macros: context.source, sourcePath: `${post.sourcePath}:${node.position?.start.line + post.frontmatterLines}`, outputDir: undefined });
      node.diagram.svg = result.svg;
    })());
  };
  visit(post.tree, processNode);
  await Promise.all(diagramTasks);
  await processAssets(post, staticDir, registry, publicAssets);
  const renderer = unified().use(remarkRehype, { handlers, footnoteLabel: 'Footnotes', footnoteBackContent: '↩︎', clobberPrefix: `${post.slug}-` }).use(rehypeStringify, { allowDangerousHtml: true });
  const htmlTree = await renderer.run(post.tree);
  post.html = renderer.stringify(htmlTree);
  post.searchText = nodeText(post.tree).replace(/\s+/g, ' ').trim();
  post.readingMinutes = Math.max(1, Math.ceil(post.searchText.split(/\s+/).length / 180));
  post.refs = registry.entries(post);
  try { post.titleHtml = post.originalTitle.split(/(\$[^$]+\$)/g).map((part) => part.startsWith('$') ? context.render(part.slice(1, -1)) : part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')).join(''); }
  catch (error) { throw new Error(`${post.sourcePath}: invalid mathematics in frontmatter title: ${error.message}`); }
}

/** Parse every document, collect every included label, then render/resolve. No build-order dependence. */
export async function compilePosts({ includeDrafts = false, postsDir = path.resolve('src/content/posts'), sharedMacrosPath = path.resolve('src/data/math-macros.tex'), staticDir = path.resolve('.generated/public') } = {}) {
  const sharedSource = await fs.readFile(sharedMacrosPath, 'utf8');
  const publicAssets = new Set((await readAssetManifest()).map((name) => `/${name}`));
  publicAssets.add('/favicon.svg');
  const files = await markdownFiles(postsDir);
  const parsedPosts = await Promise.all(files.map(async (sourcePath) => {
    const source = (await fs.readFile(sourcePath, 'utf8')).replace(/\r\n/g, '\n');
    if (!source.startsWith('---\n')) throw new Error(`${sourcePath}: posts must begin with YAML frontmatter delimited by ---`);
    let parsed;
    try { parsed = matter(source, { engines: { yaml: (value) => loadYaml(value, { schema: JSON_SCHEMA }) } }); } catch (error) { throw new Error(`${sourcePath}: invalid frontmatter: ${error.message}`); }
    const result = postSchema.safeParse(parsed.data);
    if (!result.success) throw new Error(`${sourcePath}: invalid frontmatter: ${result.error.issues.map((issue) => `${issue.path.join('.') || 'post'}: ${issue.message}`).join('; ')}`);
    const data = result.data;
    return { ...data, title: plainTitle(data.title), originalTitle: data.title, summary: plainTitle(data.summary), tags: [...new Set(data.tags)], sourcePath, url: `/blog/${data.slug}/`, frontmatterLines: source.slice(0, source.length - parsed.content.length).split('\n').length - 1, tree: parser.parse(parsed.content) };
  }));
  // Validate slug uniqueness even for drafts, then exclude their content and assets completely.
  const allSlugs = new Set();
  for (const post of parsedPosts) {
    if (allSlugs.has(post.slug)) throw new Error(`${post.sourcePath}: duplicate post slug "${post.slug}"`);
    allSlugs.add(post.slug);
  }
  const posts = parsedPosts.filter((post) => includeDrafts || !post.draft);
  const registry = new ReferenceRegistry();
  posts.forEach((post) => registry.addPost(post));
  posts.forEach((post) => collectPostStructure(post, registry));
  await Promise.all(posts.map((post) => renderPost(post, registry, sharedSource, staticDir, publicAssets)));
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)).map(({ tree, macros, originalTitle, frontmatterLines, ...post }) => post);
}
