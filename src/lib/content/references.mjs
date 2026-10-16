/** Document-level labels. Collection and resolution deliberately happen in separate passes. */
export class ReferenceRegistry {
  constructor() {
    this.posts = new Map();
  }

  addPost(post) {
    if (this.posts.has(post.slug)) throw new Error(`${post.sourcePath}: duplicate post slug "${post.slug}"`);
    this.posts.set(post.slug, { post, labels: new Map() });
  }

  addLabel(post, id, target, node) {
    if (!/^[A-Za-z][A-Za-z0-9_.:-]*$/.test(id)) fail(post, node, `Invalid label "${id}"; start with a letter and use letters, digits, _, ., :, or -`);
    if (['main', 'top', 'footnote-label'].includes(id) || id.startsWith(`${post.slug}-fn-`) || id.startsWith(`${post.slug}-fnref-`)) {
      fail(post, node, `Label "${id}" is reserved for the page layout or generated footnotes; choose a different semantic ID`);
    }
    const labels = this.posts.get(post.slug).labels;
    if (labels.has(id)) fail(post, node, `Duplicate label "${id}" (already defined on line ${labels.get(id).line ?? '?'})`);
    const entry = { ...target, id, slug: post.slug, line: sourceLine(post, node) };
    labels.set(id, entry);
    return entry;
  }

  resolve(post, requested, node, { postOnly = false } = {}) {
    if (postOnly) {
      const target = this.posts.get(requested)?.post;
      if (!target) fail(post, node, `Unknown post "${requested}"; draft targets are unavailable in a production build`);
      return { href: target.url, text: target.title, kind: 'post' };
    }
    const separator = requested.indexOf('#');
    const slug = separator >= 0 ? requested.slice(0, separator) || post.slug : post.slug;
    const id = separator >= 0 ? requested.slice(separator + 1) : requested;
    const targetPost = this.posts.get(slug);
    if (!targetPost) fail(post, node, `Unknown cross-post target "${slug}" in reference "${requested}"; draft targets are unavailable in production`);
    const target = targetPost.labels.get(id);
    if (!target) fail(post, node, `Unresolved reference "${requested}"`);
    return { ...target, href: slug === post.slug ? `#${id}` : `${targetPost.post.url}#${id}` };
  }

  entries(post) {
    return Array.from(this.posts.get(post.slug).labels.values());
  }
}

export function sourceLine(post, node) {
  return node?.position?.start?.line ? node.position.start.line + (post.frontmatterLines || 0) : undefined;
}

export function fail(post, node, message) {
  const line = sourceLine(post, node);
  throw new Error(`${post.sourcePath}${line ? `:${line}` : ''}: ${message}`);
}

/** TeX labels are extracted from math AST values, never from generated HTML. */
export function extractMathLabel(value, post, node) {
  const labels = [...value.matchAll(/\\label\s*\{([^{}]+)\}/g)];
  if (labels.length > 1) fail(post, node, 'Use one stable \\label per display; split separately numbered equations into separate displays');
  if (labels.length && node.type !== 'math') fail(post, node, '\\label is only supported in display math');
  return { id: labels[0]?.[1], tex: value.replace(/\\label\s*\{[^{}]+\}/g, '') };
}

export function resolveMathReferences(tex, post, node, registry) {
  node.mathReferences = [];
  return tex.replace(/\\(eqref|ref)\s*\{([^{}]+)\}/g, (_, command, target) => {
    const resolved = registry.resolve(post, target, node);
    if (command === 'eqref' && resolved.kind !== 'equation') fail(post, node, `\\eqref{${target}} must refer to an equation`);
    const text = command === 'eqref' ? `(${resolved.number})` : resolved.kind === 'equation' ? String(resolved.number) : resolved.text;
    node.mathReferences.push({ ...resolved, mathText: text });
    // URLs/labels are constrained before reaching this stage. Escape prose for TeX \text.
    const safeText = text.replace(/[\\{}%#$&_]/g, (char) => `\\${char}`);
    // KaTeX's visual HTML is aria-hidden; putting anchors there creates hidden
    // keyboard stops. The compiler emits ordinary accessible links alongside
    // the formula, with this text occupying the intended mathematical position.
    return `\\text{${safeText}}`;
  });
}
