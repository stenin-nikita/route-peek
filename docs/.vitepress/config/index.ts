import { defineConfig } from 'vitepress';
import { en } from './locales/en';
import { ru } from './locales/ru';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',

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
