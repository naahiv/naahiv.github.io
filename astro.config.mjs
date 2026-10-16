import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://naahiv.github.io',
  output: 'static',
  trailingSlash: 'always',
  publicDir: './.generated/public',
  outDir: process.env.INCLUDE_DRAFTS === 'true' ? './dist-preview' : './dist',
  devToolbar: { enabled: false },
  vite: { server: { fs: { allow: ['.'] } } },
});
