import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/data/site';

// Fully static output. Deployable as-is to Cloudflare Pages, Vercel or GitHub Pages
// (build command: `npm run build`, output directory: `dist`).
export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
