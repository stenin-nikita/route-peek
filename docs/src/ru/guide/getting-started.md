# Быстрый старт {#getting-started}

## Требования {#prerequisites}

- [Node.js](https://nodejs.org/) версии 18 или выше.

## Установка {#installation}

Вы можете установить `route-peek` с помощью менеджера пакетов JavaScript:

::: code-group

```sh [npm]
npm add route-peek
```

```sh [pnpm]
pnpm add route-peek
```

```sh [yarn]
yarn add route-peek
```

```sh [bun]
bun add route-peek
```

:::

## Использование {#usage}

```ts [index.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:[0-9]+}');

console.log(pattern.match('/users/1234')); // { id: '1234' }
```
