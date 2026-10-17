import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));

// Working notes, screenshots, logs, and test reports stay outside the checkout.
export function externalWorkDirectory(root = repositoryRoot) {
  root = path.resolve(root);
  const genericTesting = path.resolve(root, '..', 'Generic testing');
  const checkoutId = createHash('sha256').update(root).digest('hex').slice(0, 12);
  const directory = path.resolve(process.env.WEBSITE_WORK_DIR || (
    existsSync(genericTesting)
      ? path.join(genericTesting, 'website-work', path.basename(root))
      : path.join(os.tmpdir(), 'website-work', `${path.basename(root)}-${checkoutId}`)
  ));
  const relative = path.relative(root, directory);
  if (!relative || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`))) {
    throw new Error('WEBSITE_WORK_DIR must be outside the website checkout.');
  }
  return directory;
}

export const workDirectory = externalWorkDirectory();
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(workDirectory);
}
