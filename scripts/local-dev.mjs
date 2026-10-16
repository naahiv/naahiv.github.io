import fs from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

if (process.platform !== 'linux') throw new Error('Run this helper through WSL; use Start draft preview.cmd.');

const root = await fs.realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const script = path.join(root, 'scripts/local-dev.mjs');
const work = path.join(root, 'work');
const lock = path.join(work, 'local-authoring.lock');
const stateFile = path.join(lock, 'server.json');
const protocol = 'naahiv-local-authoring-v1';
const port = 4323;
const action = process.argv[2] || 'start';
process.chdir(root);

async function processIdentity(pid) {
  try {
    const [cwd, stat, command] = await Promise.all([
      fs.realpath(`/proc/${pid}/cwd`), fs.readFile(`/proc/${pid}/stat`, 'utf8'),
      fs.readFile(`/proc/${pid}/cmdline`, 'utf8'),
    ]);
    return { cwd, started: stat.slice(stat.lastIndexOf(')') + 2).split(' ')[19], command: command.split('\0') };
  } catch (error) {
    if (['ENOENT', 'ESRCH'].includes(error.code)) return null;
    throw error;
  }
}

async function currentState() {
  let state;
  try { state = JSON.parse(await fs.readFile(stateFile, 'utf8')); }
  catch (error) {
    if (error.code === 'ENOENT') return null;
    throw new Error('Cannot read the authoring server record. Check work/local-authoring.lock before retrying.', { cause: error });
  }
  if (state.protocol !== protocol || state.root !== root || !Number.isInteger(state.pid)) {
    throw new Error('The authoring server record belongs to a different checkout; refusing to use it.');
  }
  const identity = await processIdentity(state.pid);
  const live = identity && identity.cwd === root && identity.started === state.started
    && identity.command.some(argument => argument === script || argument === 'scripts/local-dev.mjs');
  return { ...state, running: Boolean(live) };
}

async function removeOwnLock(token) {
  try {
    const state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
    if (state.token !== token || state.root !== root) return;
    await fs.unlink(stateFile);
    await fs.rmdir(lock);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

if (action === 'status') {
  console.log(JSON.stringify(await currentState() ?? { protocol, root, running: false }));
} else if (action === 'stop') {
  const state = await currentState();
  if (!state?.running) {
    if (state) await removeOwnLock(state.token);
    console.log('The draft preview is already stopped.');
  } else {
    // PID, Linux start time, working directory, and command were all checked above.
    process.kill(state.pid, 'SIGTERM');
    const deadline = Date.now() + 12_000;
    while ((await currentState())?.running && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    if ((await currentState())?.running) throw new Error('The preview did not stop. Inspect its log before retrying.');
    console.log('Stopped the draft preview for this checkout.');
  }
} else if (action === 'start') {
  const existing = await currentState();
  if (existing?.running) {
    console.log('The draft preview for this checkout is already starting or running.');
    process.exit(0);
  }
  if (existing) await removeOwnLock(existing.token);
  await fs.mkdir(work, { recursive: true });
  try { await fs.mkdir(lock); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error('A preview start is already in progress. Wait a moment and retry.');
    throw error;
  }
  const identity = await processIdentity(process.pid);
  const state = { protocol, root, port, pid: process.pid, started: identity.started, token: randomUUID() };
  await fs.writeFile(stateFile, JSON.stringify(state));
  let child;
  let stopping = false;
  const shutdown = async (code = 0) => {
    if (stopping) return;
    stopping = true;
    if (child && child.exitCode === null) {
      try { process.kill(-child.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
      await Promise.race([
        new Promise(resolve => child.once('exit', resolve)),
        new Promise(resolve => setTimeout(resolve, 5000)),
      ]);
      if (child.exitCode === null) {
        try { process.kill(-child.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
      }
    }
    await removeOwnLock(state.token);
    process.exit(code);
  };
  process.on('SIGTERM', () => { void shutdown(); });
  process.on('SIGINT', () => { void shutdown(); });
  try {
    // Do not prepare (which clears generated files) if this port is already occupied.
    await new Promise((resolve, reject) => {
      const probe = net.createServer();
      probe.once('error', reject);
      probe.listen(port, '127.0.0.1', () => probe.close(resolve));
    });
    process.env.ASTRO_TELEMETRY_DISABLED = '1';
    process.env.CHOKIDAR_USEPOLLING = 'true';
    process.env.CHOKIDAR_INTERVAL = '500';
    process.env.INCLUDE_DRAFTS = 'true';
    await import(pathToFileURL(path.join(root, 'scripts/prepare.mjs')).href);
    const configPath = path.join(work, 'astro-local.config.mjs');
    const identityJson = JSON.stringify({ ...state, running: true });
    await fs.writeFile(configPath, `import base from '../astro.config.mjs';
export default {
  ...base,
  server: { ...base.server, host: '127.0.0.1', port: ${port} },
  vite: {
    ...base.vite,
    server: { ...base.vite?.server, strictPort: true, watch: { ...base.vite?.server?.watch, usePolling: true, interval: 500 } },
    plugins: [...(base.vite?.plugins || []), {
      name: 'local-authoring-identity',
      configureServer(server) {
        server.middlewares.use('/__local-authoring.json', (_request, response) => {
          response.setHeader('Content-Type', 'application/json');
          response.setHeader('Cache-Control', 'no-store');
          response.end(${JSON.stringify(identityJson)});
        });
      },
    }],
  },
};
`);
    console.log(`Starting draft preview for ${root} at http://127.0.0.1:${port}/blog/`);
    child = spawn(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'dev', '--config', path.relative(root, configPath)], {
      cwd: root, stdio: 'inherit', detached: true,
      // The wrapper owns persistence; prevent agent-detected auto-backgrounding in Astro.
      env: { ...process.env, ASTRO_DEV_BACKGROUND: '1' },
    });
    child.once('error', error => { console.error(error); void shutdown(1); });
    child.once('exit', (code, signal) => {
      if (!stopping) { console.log(`Draft server stopped (${signal || code}).`); void shutdown(code || 0); }
    });
  } catch (error) {
    console.error(error);
    await shutdown(1);
  }
} else {
  throw new Error('Expected start, stop, or status.');
}
