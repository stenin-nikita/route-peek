# Синтаксис {#syntax}

## Фиксированные сегменты {#fixed-segments}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users') // [!code focus]
  .build();
```

## Динамические сегменты {#dynamic-segments}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users/{id}') // [!code focus]
  .build();
```

## Использование регулярных выражений {#regexp}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users/{id:\\d+}') // [!code focus]
  .build();
```

## Несколько элементов в сегменте {#multiple-elements}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/static/{fileName:[a-z]+}-{hash:[a-zA-Z0-9]+}.{ext:js|css}') // [!code focus]
  .build();
```

## Wildcard-сегменты {#wildcard-segments}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users/*') // [!code focus]
  .build();
```

## Модификаторы {#modifiers}

### Опциональный сегмент {#modifier-question}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/{page}?') // [!code focus]
  .build();
```

### Ноль и более {#modifier-zero-and-more}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/{page}*') // [!code focus]
  .build();
```

### Один и более {#modifier-one-and-more}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/{page}+') // [!code focus]
  .build();
```
