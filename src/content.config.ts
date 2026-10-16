import { defineCollection } from 'astro:content';
import path from 'node:path';
import { compilePosts } from './lib/content/compile.mjs';
// A custom loader lets labels resolve across every included document before rendering.
const posts = defineCollection({
  loader: {
    name: 'mathematical-markdown',
    async load({ store, parseData, watcher, logger }) {
      const sync = async () => {
        const compiled = await compilePosts({
          includeDrafts: process.env.INCLUDE_DRAFTS === 'true' || import.meta.env.DEV,
          staticDir: '.generated/public',
        });
        const records = await Promise.all(compiled.map(async post => ({id:post.slug, data:await parseData({id:post.slug, data:post})})));
        store.clear();
        for (const record of records) store.set(record);
      };
      await sync();
      if (watcher) {
        const directory=path.resolve('src/content/posts');
        const macros=path.resolve('src/data/math-macros.tex');
        watcher.add([directory,macros]);
        let pending: ReturnType<typeof setTimeout>;
        watcher.on('all', (_event, file) => {
          const absolute=path.resolve(file);
          if(absolute===macros || absolute.startsWith(directory+path.sep)) {
            clearTimeout(pending);
            pending=setTimeout(()=>{sync().catch(error=>logger.error(error.message));},100);
          }
        });
      }
    },
  },
});
export const collections = { posts };
