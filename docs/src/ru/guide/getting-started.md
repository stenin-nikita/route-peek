# Быстрый старт {#getting-started}

Следуйте этим простым шагам, чтобы быстро начать использовать `route-peek` в своём приложении.

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

> [!TIP] Примечание о совместимости
> Пожалуйста, убедитесь, что в вашем проекте установлен [Node.js](https://nodejs.org/) версии 18 или выше.

## Использование {#usage}

Импортируйте `route-peek` в ваш проект:

```ts [index.ts]
import { PathPattern } from 'route-peek';
```

Определите шаблон для маршрута, который вы хотите сопоставить:

```ts [index.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:[0-9]+}'); // [!code focus]
```

Используйте созданный шаблон для сопоставления URL и извлечения параметров:

```ts [index.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{userId:[0-9]+}');
const result = pattern.exec('/users/123'); // [!code focus:5]

if (result) {
  console.log(result.userId); // Вывод: 123
}
```
