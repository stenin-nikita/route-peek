# 🧱 Route Peek

![NPM Version](https://img.shields.io/npm/v/route-peek)
![NPM Downloads](https://img.shields.io/npm/dm/route-peek)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/route-peek)
![NPM License](https://img.shields.io/npm/l/route-peek)

The library for creating and matching dynamic routes.

## Documentation

👉 Read the [Route Peek docs](https://stenin-nikita.github.io/route-peek/)

## Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher.

## Installation

You can install `route-peek` using the JavaScript package manager:

```shell
npm add route-peek
```

## Usage

```ts
import { PathPattern } from 'route-peek';

const pattern = new PathPattern('/users/{id:[0-9]+}');

console.log(pattern.test('/users/1234')); // true
console.log(pattern.match('/users/1234')); // { id: '1234' }
```

## License

MIT
