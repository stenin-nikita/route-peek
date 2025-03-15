# Syntax

## Fixed segments

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users') // [!code focus]
  .build();
```

## Dynamic segments

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users/{id}') // [!code focus]
  .build();
```

## Using regular expressions {#regexp}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users/{id:\\d+}') // [!code focus]
  .build();
```

## Multiple elements

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/static/{fileName:[a-z]+}-{hash:[a-zA-Z0-9]+}.{ext:js|css}') // [!code focus]
  .build();
```

## Wildcard segments

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/users/*') // [!code focus]
  .build();
```

## Modifiers

### Optional segment {#modifier-question}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/{page}?') // [!code focus]
  .build();
```

### Zero and more {#modifier-zero-and-more}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/{page}*') // [!code focus]
  .build();
```

### One and more {#modifier-one-and-more}

```ts [example.ts]
import { RouteMatcherBuilder } from 'route-peek';

const matcher = new RouteMatcherBuilder()
  .add('/{page}+') // [!code focus]
  .build();
```
