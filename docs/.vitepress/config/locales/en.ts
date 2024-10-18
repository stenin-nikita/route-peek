import { defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  description: 'Library for creating matches with route patterns',

  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/getting-started',
        activeMatch: '/guide/',
      },
    ],

    sidebar: {
      '/guide/': {
        base: '/guide/',
        items: [
          {
            text: 'Introduction',
            collapsed: false,
            items: [
              { text: 'What is Route Peek?', link: 'what-is-route-peek' },
              { text: 'Getting Started', link: 'getting-started' },
            ],
          },
          {
            text: 'Basic',
            collapsed: false,
            items: [{ text: 'Syntax', link: 'syntax' }],
          },
        ],
      },
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Nikita Stenin',
    },
  },
});
