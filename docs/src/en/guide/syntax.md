# Syntax

## Fixed segments

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users'); // [!code focus]
```

## Dynamic segments

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id}'); // [!code focus]
```

## Using regular expressions {#regexp}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:\\d+}'); // [!code focus]
```

## Multiple elements

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/static/{fileName:[a-z]+}-{hash:[a-zA-Z0-9]+}.{ext:js|css}'); // [!code focus]
```

## Wildcard segments

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/*'); // [!code focus]
```

## Modifiers

### Optional segment {#modifier-question}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/{page}?'); // [!code focus]
```

### Zero and more {#modifier-zero-and-more}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/{page}*'); // [!code focus]
```

### One and more {#modifier-one-and-more}

```ts [example.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/{page}+'); // [!code focus]
```
