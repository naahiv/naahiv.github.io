import {rm,mkdir,writeFile} from 'node:fs/promises';
await rm('.generated/public',{recursive:true,force:true});
await rm('.astro',{recursive:true,force:true});
await mkdir('.generated/public',{recursive:true});
const {stageAssets} = await import('./stage-assets.mjs');
await stageAssets();
await writeFile('.generated/public/.nojekyll','');
await writeFile('.generated/public/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#254c48"/><text x="32" y="44" text-anchor="middle" font-size="39" fill="#faf9f6" font-family="Georgia,serif">V</text></svg>');
