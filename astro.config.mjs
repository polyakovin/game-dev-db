import { defineConfig } from 'astro/config';
import { SITE, BASE } from './src/lib/site-config.mjs';

export default defineConfig({
  site: SITE,
  base: BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: 'github-dark' } },
  vite: { server: { host: '127.0.0.1' } },
});
