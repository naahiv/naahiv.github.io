import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

const execFileAsync = promisify(execFile);
const PROFILE_VERSION = 'native-tikzcd-dvi-v4';
const PACKAGES = ['standalone.cls', 'preview.sty', 'tikz.sty', 'pgf.revision.tex', 'pgfsys-dvisvgm.def', 'tikz-cd.sty', 'amsmath.sty', 'amssymb.sty', 'mathtools.sty', 'mathrsfs.sty', 'spath3.sty', 'tikzlibraryspath3.code.tex', 'tikzlibrarydecorations.pathmorphing.code.tex', 'pgflibrarydecorations.pathmorphing.code.tex'];
const QUIVER_PACKAGE = new URL('./tex/quiver/quiver.sty', import.meta.url);
const PREAMBLE = String.raw`\documentclass[dvisvgm,preview,multi=tikzpicture,border=5pt]{standalone}
\def\pgfsysdriver{pgfsys-dvisvgm.def}
\usepackage{tikz}
\usepackage{tikz-cd}
\usepackage{amsmath,amssymb,mathtools,mathrsfs}
\usepackage{quiver}
\usetikzlibrary{arrows.meta,decorations.markings,calc}
`;
const SVG_NS = 'http://www.w3.org/2000/svg';
const ALLOWED_ELEMENTS = new Set(['svg', 'g', 'defs', 'path', 'rect', 'line', 'polyline', 'polygon', 'circle', 'ellipse', 'use', 'clipPath', 'mask']);
const ALLOWED_ATTRIBUTES = new Set(['id', 'xmlns', 'xmlns:xlink', 'version', 'viewBox', 'width', 'height', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'transform', 'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'opacity', 'clip-path', 'clip-rule', 'mask', 'href', 'xlink:href', 'preserveAspectRatio']);

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

function safeId(value) {
  const id = String(value ?? '').replace(/[^a-zA-Z0-9_-]/g, '-');
  if (!id) throw new Error('A stable, nonempty diagram id is required.');
  return id;
}

/** Only tool paths/library configuration survive: no token, key, proxy, or deploy environment. */
function restrictedEnvironment(directory) {
  const env = {};
  for (const name of ['PATH', 'LD_LIBRARY_PATH', 'FONTCONFIG_FILE', 'XDG_DATA_DIRS', 'SystemRoot', 'WINDIR', 'PATHEXT']) {
    if (process.env[name]) env[name] = process.env[name];
  }
  return {
    ...env,
    HOME: directory,
    USERPROFILE: directory,
    TMPDIR: directory,
    TEMP: directory,
    TMP: directory,
    TEXMFHOME: path.join(directory, 'texmf'),
    TEXMFVAR: path.join(directory, 'texmf-var'),
    TEXMFCONFIG: path.join(directory, 'texmf-config'),
    TEXINPUTS: '.:',
    openin_any: 'p',
    openout_any: 'p',
    shell_escape: 'f',
    LC_ALL: 'C',
    SOURCE_DATE_EPOCH: '0',
    FORCE_SOURCE_DATE: '1',
  };
}

async function executable(name) {
  const suffixes = process.platform === 'win32' ? ['', '.exe', '.cmd'] : [''];
  for (const directory of (process.env.PATH ?? '').split(path.delimiter)) {
    for (const suffix of suffixes) {
      const candidate = path.join(directory, `${name}${suffix}`);
      try {
        await access(candidate, constants.X_OK);
        return candidate;
      } catch { /* Try the next explicit tool path. */ }
    }
  }
  return null;
}

async function run(executablePath, args, { directory, env, timeout = 30_000, bounded = false }) {
  let file = executablePath;
  let argv = args;
  // Linux CI and the documented WSL workflow enforce CPU, address-space, file and fd limits.
  if (bounded && process.platform === 'linux') {
    const limiter = await executable('prlimit');
    if (!limiter) throw new Error('prlimit is required on Linux for native diagram resource limits (install util-linux).');
    file = limiter;
    argv = ['--as=1073741824', '--cpu=20', '--fsize=16777216', '--nofile=64', '--', executablePath, ...args];
  }
  return execFileAsync(file, argv, { cwd: directory, env, timeout, maxBuffer: 2 * 1024 * 1024, windowsHide: true, encoding: 'utf8' });
}

let toolchainPromise;
async function inspectToolchain(directory, env) {
  if (!toolchainPromise) toolchainPromise = (async () => {
    const names = ['latex', 'dvisvgm', 'kpsewhich'];
    const paths = Object.fromEntries(await Promise.all(names.map(async (name) => {
      const resolved = await executable(name);
      if (!resolved) throw new Error(`Native TikZ-CD needs ${name} on PATH. See docs/diagrams.md for the TeX Live installation.`);
      return [name, resolved];
    })));
    const versions = Object.fromEntries(await Promise.all(names.map(async (name) => {
      const result = await run(paths[name], ['--version'], { directory, env, timeout: 10_000 });
      return [name, result.stdout.trim()];
    })));
    const packageHashes = Object.fromEntries(await Promise.all(PACKAGES.map(async (name) => {
      const result = await run(paths.kpsewhich, [name], { directory, env, timeout: 10_000 });
      const location = result.stdout.trim();
      if (!location) throw new Error(`Missing native TeX package file ${name}; see docs/diagrams.md.`);
      return [name, digest(await readFile(location))];
    })));
    return { paths, versions, packageHashes };
  })().catch((error) => {
    toolchainPromise = undefined;
    throw error;
  });
  return toolchainPromise;
}

/** Parse generated XML, reject active/external content, then namespace every SVG reference. */
export function prepareSvg(rawSvg, { id, description = '', hash = '' }) {
  if (typeof description !== 'string') throw new Error('Diagram description must be text when supplied.');
  if (/<!DOCTYPE|<!ENTITY/i.test(rawSvg)) throw new Error('SVG document types and entities are forbidden.');
  const errors = [];
  const doc = new DOMParser({ onError: (level, message) => errors.push(`${level}: ${message}`) }).parseFromString(rawSvg, 'image/svg+xml');
  if (errors.length || doc.documentElement?.localName !== 'svg') throw new Error(`Invalid generated SVG: ${errors.join('; ')}`);
  const root = doc.documentElement;
  const prefix = `tikz-${safeId(id)}-${digest(String(id)).slice(0, 10)}-${hash.slice(0, 12) || 'source'}-`;
  const ids = new Map();
  const references = [];
  const elements = [root, ...Array.from(root.getElementsByTagName('*'))];
  for (const element of elements) {
    if (element.namespaceURI !== SVG_NS || !ALLOWED_ELEMENTS.has(element.localName)) throw new Error(`Forbidden generated SVG element <${element.nodeName}>.`);
    for (const attribute of Array.from(element.attributes)) {
      if (!ALLOWED_ATTRIBUTES.has(attribute.name)) throw new Error(`Forbidden generated SVG attribute ${attribute.name}.`);
      if (attribute.name === 'id') {
        if (ids.has(attribute.value)) throw new Error(`Duplicate generated SVG id ${attribute.value}.`);
        ids.set(attribute.value, `${prefix}${attribute.value}`);
      }
    }
  }
  for (const element of elements) {
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name === 'id') {
        element.setAttribute('id', ids.get(attribute.value));
      } else if (attribute.name === 'href' || attribute.name === 'xlink:href') {
        if (!attribute.value.startsWith('#') || !ids.has(attribute.value.slice(1))) throw new Error(`Nonlocal or missing generated SVG reference ${attribute.value}.`);
        element.setAttribute(attribute.name, `#${ids.get(attribute.value.slice(1))}`);
      } else if (/url\s*\(/i.test(attribute.value)) {
        const updated = attribute.value.replace(/url\(\s*['"]?#([^)'"\s]+)['"]?\s*\)/g, (_, target) => {
          references.push(target);
          return `url(#${ids.get(target) ?? 'MISSING'})`;
        });
        if (updated === attribute.value || /url\s*\((?!#)/i.test(updated)) throw new Error('External generated SVG URL is forbidden.');
        element.setAttribute(attribute.name, updated);
      }
    }
  }
  if (references.some((target) => !ids.has(target))) throw new Error('Missing generated SVG fragment reference.');
  // The DVI converter's explicit bbox is padded so arrowheads remain comfortably visible.
  const viewBox = (root.getAttribute('viewBox') ?? '').trim().split(/\s+/).map(Number);
  if (viewBox.length !== 4 || viewBox.some((number) => !Number.isFinite(number)) || viewBox[2] <= 0 || viewBox[3] <= 0) throw new Error('Generated SVG has an invalid viewBox.');
  const padding = 4;
  root.setAttribute('viewBox', `${viewBox[0] - padding} ${viewBox[1] - padding} ${viewBox[2] + 2 * padding} ${viewBox[3] + 2 * padding}`);
  // The wrapper uses 10pt math. Express its dimensions in em so labels track the
  // surrounding mathematical text, instead of freezing at a small 13px font.
  root.setAttribute('width', `${(viewBox[2] + 2 * padding) / 10}em`);
  root.setAttribute('height', `${(viewBox[3] + 2 * padding) / 10}em`);
  root.setAttribute('role', 'img');
  root.setAttribute('focusable', 'false');
  root.setAttribute('aria-labelledby', `${prefix}title${description.trim() ? ` ${prefix}description` : ''}`);
  root.setAttribute('fill', 'currentColor');
  root.setAttribute('class', 'tikzcd-svg');
  const title = doc.createElementNS(SVG_NS, 'title');
  title.setAttribute('id', `${prefix}title`);
  title.appendChild(doc.createTextNode('Mathematical diagram'));
  if (description.trim()) {
    const desc = doc.createElementNS(SVG_NS, 'desc');
    desc.setAttribute('id', `${prefix}description`);
    desc.appendChild(doc.createTextNode(description.trim()));
    root.insertBefore(desc, root.firstChild);
  }
  root.insertBefore(title, root.firstChild);
  return new XMLSerializer().serializeToString(root);
}

/** Native TeX source is trusted repository authoring, never a public submission API. */
export async function compileDiagram({ source, description = '', id, macros = '', sourcePath = '(inline TikZ-CD diagram)', outputDir, cacheDir = path.resolve('.cache/tikzcd') }) {
  if (typeof source !== 'string' || !source.includes(String.raw`\begin{tikzcd}`) || !source.includes(String.raw`\end{tikzcd}`)) throw new Error(`${sourcePath}: expected a complete \\begin{tikzcd} … \\end{tikzcd} environment.`);
  if (typeof macros !== 'string') throw new Error(`${sourcePath}: diagram macros must be a TeX source string.`);
  if (typeof description !== 'string') throw new Error(`${sourcePath}: diagram description must be text when supplied.`);
  if (Buffer.byteLength(source) + Buffer.byteLength(macros) > 128 * 1024) throw new Error(`${sourcePath}: diagram plus macros exceeds the 128 KiB authoring limit.`);
  const diagramId = safeId(id);
  const directory = await mkdtemp(path.join(tmpdir(), 'portfolio-tikzcd-'));
  const env = restrictedEnvironment(directory);
  try {
    const { paths, versions, packageHashes } = await inspectToolchain(directory, env);
    // Bundle Quiver so local and CI builds do not depend on the OS package version.
    const quiver = await readFile(QUIVER_PACKAGE);
    const hash = digest(JSON.stringify({ profile: PROFILE_VERSION, preamble: PREAMBLE, source, macros, versions, packageHashes, quiver: digest(quiver), options: ['--no-fonts', '--bbox=preview', '--exact'] }));
    const cacheFile = path.join(cacheDir, `${hash}.svg`);
    let rawSvg;
    let cacheHit = false;
    try {
      rawSvg = await readFile(cacheFile, 'utf8');
      cacheHit = true;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (!cacheHit) {
      await writeFile(path.join(directory, 'quiver.sty'), quiver);
      await writeFile(path.join(directory, 'diagram.tex'), `${PREAMBLE}\n${macros}\n\\begin{document}\n${source}\n\\end{document}\n`);
      try {
        const result = await run(paths.latex, ['-interaction=nonstopmode', '-halt-on-error', '-no-shell-escape', '-file-line-error', 'diagram.tex'], { directory, env, bounded: true });
        if (!result.stdout.includes('pgfsys-dvisvgm.def')) throw new Error('Expected PGF dvisvgm driver was not loaded.');
        const pageCount = result.stdout.match(/Output written on diagram\.dvi \((\d+) pages?[,)]/);
        if (!pageCount || Number(pageCount[1]) !== 1) throw new Error('Each diagram block must produce exactly one TeX picture; split multiple diagrams into separate blocks.');
      } catch (error) {
        throw new Error(`LaTeX failed${error.killed ? ' (time/resource limit)' : ''}:\n${String(error.stdout ?? error.message).slice(-9000)}\n${String(error.stderr ?? '').slice(-2000)}`);
      }
      try {
        await run(paths.dvisvgm, ['--no-fonts', '--bbox=preview', '--exact', '--output=diagram.svg', 'diagram.dvi'], { directory, env, timeout: 15_000, bounded: true });
        rawSvg = await readFile(path.join(directory, 'diagram.svg'), 'utf8');
      } catch (error) {
        throw new Error(`dvisvgm conversion failed${error.killed ? ' (time/resource limit)' : ''}:\n${String(error.stdout ?? '').slice(-4000)}\n${String(error.stderr ?? error.message).slice(-4000)}`);
      }
    }
    const svg = prepareSvg(rawSvg, { id, description, hash });
    if (!cacheHit) {
      await mkdir(cacheDir, { recursive: true });
      const temporaryCache = `${cacheFile}.${process.pid}.${digest(directory).slice(0, 8)}.tmp`;
      await writeFile(temporaryCache, rawSvg);
      await rename(temporaryCache, cacheFile);
    }
    let outputPath;
    if (outputDir) {
      await mkdir(outputDir, { recursive: true });
      outputPath = path.join(outputDir, `${diagramId}-${digest(String(id)).slice(0, 10)}-${hash.slice(0, 16)}.svg`);
      await writeFile(outputPath, svg);
    }
    return { svg, hash, cacheHit, outputPath, versions, profile: PROFILE_VERSION };
  } catch (error) {
    throw new Error(`${sourcePath}: native TikZ-CD compilation failed. ${error.message}`, { cause: error });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
