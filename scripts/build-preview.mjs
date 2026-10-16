import {spawnSync} from 'node:child_process';
await import('./prepare.mjs');
const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'inherit',env:{...process.env,INCLUDE_DRAFTS:'true'}});
process.exitCode=result.status ?? 1;
