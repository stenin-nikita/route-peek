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
import { RouteMatcherBuilder } from 'route-peek';

const builder = new RouteMatcherBuilder();

builder.add('/');
builder.add('/users');
builder.add('/users/{id:[0-9]+}');

const matcher = builder.build();
const matchedRoutes = matcher.match('/users/1234');

console.log(matchedRoutes); // [{"path":"/users/1234","route":"/users/{id:[0-9]+}","params":{"id":"1234"},"score":154}]
```

## License

MIT
