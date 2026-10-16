import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Only these root assets enter Astro's public directory. Never copy the repository. */
export async function readAssetManifest(rootDir = repositoryRoot) {
  const manifest = JSON.parse(await readFile(join(rootDir, 'src/data/legacy-assets.json'), 'utf8'));
  if (!Array.isArray(manifest) || new Set(manifest).size !== manifest.length) {
    throw new Error('src/data/legacy-assets.json must contain unique root filenames.');
  }
  for (const filename of manifest) {
    if (typeof filename !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(filename)) {
      throw new Error(`Unsafe asset path in src/data/legacy-assets.json: ${String(filename)}`);
    }
  }
  return manifest;
}

export async function stageAssets({ rootDir = repositoryRoot, outputDir = join(rootDir, '.generated/public') } = {}) {
  const manifest = await readAssetManifest(rootDir);
  await mkdir(outputDir, { recursive: true });
  for (const filename of manifest) {
    try {
      await copyFile(join(rootDir, filename), join(outputDir, filename));
    } catch (cause) {
      throw new Error(`Cannot stage canonical public asset ${filename}: ${cause.message}`, { cause });
    }
  }
  // Other generators own their own subdirectories; leave their output untouched.
  return { outputDir, count: manifest.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const rootArg = process.argv.find((arg) => arg.startsWith('--root='));
  const outArg = process.argv.find((arg) => arg.startsWith('--out='));
  const result = await stageAssets({
    ...(rootArg ? { rootDir: resolve(rootArg.slice(7)) } : {}),
    ...(outArg ? { outputDir: resolve(outArg.slice(6)) } : {}),
  });
  console.log(`Staged ${result.count} canonical assets in ${result.outputDir}.`);
}
