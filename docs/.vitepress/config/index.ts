import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';

import { en } from './locales/en';
import { ru } from './locales/ru';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  base: '/route-peek/',

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },

    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },

  title: 'Route Peek',

  lastUpdated: true,
  cleanUrls: true,

  rewrites: {
    'en/:rest*': ':rest*',
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/stenin-nikita/route-peek' }],
  },

  locales: {
    root: { label: 'English', ...en },
    ru: { label: 'Русский', ...ru },
  },
});
