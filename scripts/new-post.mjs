import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const help = `Create a draft mathematics post without overwriting existing work.

Usage: npm run new:post -- descriptive-slug --title "Post title" [--date YYYY-MM-DD]
       node scripts/new-post.mjs descriptive-slug --dir /path/to/posts

Options:
  --title  Post title (defaults to the slug with spaces)
  --date   Publication date (defaults to today's local date)
  --dir    Destination posts directory (defaults to src/content/posts)
  --help   Show this help

The command creates <posts directory>/<slug>/index.md with draft: true.
Replace the instructional example before publishing. The slug is the stable URL.
`;

function localDate() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

async function main() {
  const { values, positionals } = parseArgs({
    options: { title: { type: 'string' }, date: { type: 'string' }, dir: { type: 'string' }, help: { type: 'boolean' } },
    allowPositionals: true,
  });
  if (values.help) { console.log(help); return; }
  if (positionals.length !== 1) throw new Error('Supply exactly one slug. Run with --help for usage.');
  const slug = positionals[0];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid slug: use lowercase letters, digits, and single hyphens (for example, a-first-observation).');
  if (['archive', 'tags'].includes(slug)) throw new Error(`Reserved slug "${slug}": choose a slug other than archive or tags, which belong to blog navigation.`);
  const title = (values.title ?? slug.replaceAll('-', ' ')).trim();
  if (!title || title.length > 180) throw new Error('The title must contain 1–180 characters.');
  const date = values.date ?? localDate();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    throw new Error('Invalid date: use a real calendar date in YYYY-MM-DD format.');
  }
  const postsDirectory = values.dir ? path.resolve(values.dir) : path.join(root, 'src/content/posts');
  const directory = path.join(postsDirectory, slug);
  const template = await readFile(path.join(root, 'templates/post.md'), 'utf8');
  const substitutions = { TITLE_YAML: JSON.stringify(title), SLUG: slug, DATE: date };
  const source = template.replace(/\{\{(TITLE_YAML|SLUG|DATE)\}\}/g, (_, key) => substitutions[key]);
  await mkdir(postsDirectory, { recursive: true });
  try { await mkdir(directory); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Refusing to overwrite existing post directory: ${directory}`);
    throw error;
  }
  await writeFile(path.join(directory, 'index.md'), source, { flag: 'wx' });
  console.log(`Created draft ${path.join(directory, 'index.md')}`);
  console.log(`Edit its content, then run npm run dev and open /blog/${slug}/.`);
}

main().catch((error) => { console.error(`new-post: ${error.message}`); process.exitCode = 1; });
