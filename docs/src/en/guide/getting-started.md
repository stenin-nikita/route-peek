# Getting Started

Follow these simple steps to quickly start using `route-peek` in your application.

## Installation

You can install `route-peek` using the JavaScript package manager:

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

> [!TIP] Compatibility Note
> Please ensure that [Node.js](https://nodejs.org/) version 18 or higher is installed in your project.

## Usage

Import `route-peek` into your project:

```ts [index.ts]
import { PathPattern } from 'route-peek';
```

Define a pattern for the route you want to match:

```ts [index.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:[0-9]+}'); // [!code focus]
```

Use the created pattern to match a URL and extract parameters:

```ts [index.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{userId:[0-9]+}');
const result = pattern.exec('/users/123'); // [!code focus:5]

if (result) {
  console.log(result.userId); // Output: 123
}
```
