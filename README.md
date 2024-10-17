# Route Peek

## Installation

```shell
npm install route-peek --save
```

## Usage

```ts
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:\\d+}/edit');

pattern.scope; // number
pattern.routePath; // /users/{id:\\d+}/edit
pattern.pattern; // RegExp
pattern.segments; // Segment[]
pattern.match('/users/12/edit'); // { id: '12' }
pattern.match('/users/12'); // null
```

## License

MIT
