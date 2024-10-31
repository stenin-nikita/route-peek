import { defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  description: 'The library for creating and matching dynamic routes',

  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/getting-started',
        activeMatch: '/guide/',
      },
    ],

    sidebar: {
      '/': {
        base: '/',
        items: [
          {
            text: 'Introduction',
            base: '/introdution/',
            collapsed: false,
            items: [
              { text: 'What is Route Peek?', link: 'what-is-route-peek' },
              { text: 'Motivation', link: 'motivation' },
            ],
          },
          {
            text: 'Basic',
            base: '/guide/',
            collapsed: false,
            items: [
              { text: 'Getting Started', link: 'getting-started' },
              { text: 'Patterns syntax', link: 'syntax' },
            ],
          },
          {
            text: 'Contribute',
            base: '/contribute/',
            collapsed: false,
            items: [
              { text: 'Discussions', link: 'discussions' },
              { text: 'Contributing Guide', link: 'guide' },
              { text: 'Changelog', link: 'changelog' },
            ],
          },
        ],
      },
    },

    editLink: {
      pattern: 'https://github.com/stenin-nikita/route-peek/edit/main/docs/src/:path',
      text: 'Suggest changes',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Nikita Stenin',
    },
  },
});
