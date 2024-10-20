# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher.

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

## Usage

```ts [index.ts]
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:[0-9]+}');

console.log(pattern.exec('/users/1234')); // { id: '1234' }
```
