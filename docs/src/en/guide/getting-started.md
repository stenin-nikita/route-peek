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
import { RouteMatcherBuilder } from 'route-peek';
```

Define a routes you want to match:

```ts [index.ts]
import { RouteMatcherBuilder } from 'route-peek';

const builder = new RouteMatcherBuilder(); // [!code focus:6]

builder.add('/');
builder.add('/users/{id:[0-9]+}');

const matcher = builder.build();
```

Use the created instance to match a URL and extract parameters:

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
