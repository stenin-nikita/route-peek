import { defineConfig } from 'vitepress';

export const ru = defineConfig({
  lang: 'ru-RU',
  description: 'Библиотека для создания совпадений с шаблонами маршрутов',

  themeConfig: {
    nav: [
      {
        text: 'Руководство',
        link: '/ru/guide/getting-started',
        activeMatch: '/ru/guide/',
      },
    ],

    sidebar: {
      '/ru/guide/': {
        base: '/ru/guide/',
        items: [
          {
            text: 'Введение',
            collapsed: false,
            items: [
              { text: 'Что такое Route Peek?', link: 'what-is-route-peek' },
              { text: 'Быстрый старт', link: 'getting-started' },
            ],
          },
        ],
      },
    },

    footer: {
      message: 'Опубликовано под лицензией MIT.',
      copyright: '© 2024 – настоящее время, Никита Стенин',
    },

    lastUpdated: {
      text: 'Обновлено',
    },

    outline: { label: 'Содержание страницы' },

    docFooter: {
      prev: 'Предыдущая страница',
      next: 'Следующая страница',
    },

    darkModeSwitchLabel: 'Оформление',
    lightModeSwitchTitle: 'Переключить на светлую тему',
    darkModeSwitchTitle: 'Переключить на тёмную тему',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Вернуться к началу',
    langMenuLabel: 'Изменить язык',
  },
});
