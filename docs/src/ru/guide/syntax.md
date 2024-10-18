# Синтаксис {#syntax}

## Фиксированные сегменты {#fixed-segments}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users'); // [!code focus]
```

## Динамические сегменты {#dynamic-segments}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id}'); // [!code focus]
```

## Использование регулярных выражений {#regexp}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:\\d+}'); // [!code focus]
```

## Несколько элементов в сегменте {#multiple-elements}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/static/{fileName:[a-z]+}-{hash:[a-zA-Z0-9]+}.{ext:js|css}'); // [!code focus]
```

## Wildcard-сегменты {#wildcard-segments}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/*'); // [!code focus]
```

## Модификаторы {#modifiers}

### Опциональный сегмент {#modifier-question}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/{page}?'); // [!code focus]
```

### Ноль и более {#modifier-zero-and-more}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/{page}*'); // [!code focus]
```

### Один и более {#modifier-one-and-more}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/{page}+'); // [!code focus]
```
