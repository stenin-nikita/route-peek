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
import { RouteMatcherBuilder } from 'route-peek';
```

Определите маршруты, которые вы хотите сопоставить:

```ts [index.ts]
import { RouteMatcherBuilder } from 'route-peek';

const builder = new RouteMatcherBuilder(); // [!code focus:6]

builder.add('/');
builder.add('/users/{id:[0-9]+}');

const matcher = builder.build();
```

Используйте созданный экземпляр для сопоставления URL и извлечения параметров:

```ts [index.ts]
import { RouteMatcherBuilder } from 'route-peek';

const builder = new RouteMatcherBuilder();

builder.add('/');
builder.add('/users/{id:[0-9]+}');

const matcher = builder.build();
const matchedRoutes = matcher.match('/users/123'); // [!code focus:5]

for (const matchedRoute of matchedRoutes) {
  console.log(matchedRoute);
}
```
