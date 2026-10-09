import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://polyakovin.github.io',
  base: '/game-dev-db',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: 'github-dark' } },
  vite: { server: { host: '127.0.0.1' } },
});
