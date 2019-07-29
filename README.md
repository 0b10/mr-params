# TL;DR

Get parameter names from a given function reference, and optionally cache the results.

## Supports
ES6+

* Typical parameters
* Array destructuring
* Object destructuring
* Comments
* Default args

## Features

* Cache/Memoization
* Wrapping results with argument values
* Results are ordered by their (parameters) appearance in the function spec

## Example

```js
const factory = require("mr-params").default;
const getParams = factory();
exports = getParams;
```

It's recommended that you run the factory once, because it initiates a cache.

```js
const getParams = require("./my-module");
getParams((a) => undefined); // => ["a"]
```

## Options

```js
const factory = require("mr-params").default;
const getParams = factory({
  cache: true, // default.
  debug: false, // default. Used internally. Not useful, for now.
  cacheFactory: nativeCacheFactory // default. Optionally replace the caching mechanism
});
```

## Wrap
You can wrap the results with their related values - typically you'd use an args array:

```js
getParams((a, b, c) => undefined, [1, 2, 3]); // => {a: 1, b: 2, c: 3}

// with: args = ["foo", "bar", "baz"]
getParams((a, b, c) => undefined, args); // don't spread args. => {a: "foo", b: "bar", c: "baz"}
```

## Dependencies

* @babel/parse

* @babel/traverse

* farmhash


# In Depth

## How It Works
On first usage for a function reference, it will build a Babel AST for the entire function. All tokens are ignored, except parameters that are in scope (of the function body). The results are cached, avoiding the expensive process of rebuilding the AST.

1. toString() the function and hash it
1. Check the cache, using the hash as the key, return result on hit, continue on miss
1. Build an AST for the complete function extract the parameters
1. Store the result in the cache
1. Return the result

## Cache
You can replace the cache with your own implementation:

```js
const getParams = factory({ cacheFactory: myCacheFactory });
```

The cache factory must return a cache object with the following (TS) interface:

```typescript
interface ICacheOps {
  get: (key: string) => string[] | false | undefined; // undefined on cache miss.
  put: (key: string, val: string[] | false) => void; // an array of strings, or false
}
```

This interface is also exported from the main module, if you use Typescript.

### Example

```typescript
const myCacheFactory = (): ICacheOps => {{
  get: (k) => ["foo", "bar", "baz"], // or false
  put: (k, v) => undefined
}}
```

### Explanation
The internal parse() function can return either an array of strings (parameter names), or false (no parameters found). This parse() function feeds the cache, and these are the only two states that are ever put().

On a cache miss, get() must return undefined. On hit, an array of parameter names (strings), or false - for 0 parameter names.

# Samples That Pass Tests

```js
getParams((a, b, c) => undefined); // ["a", "b", "c"]

function fn1(a = (x, y = () => undefined, z) => undefined, [ b, [ d, [ f, [ g ] ] ] ], { c: { e: { h: { i } } } }, v) {};
getParams(fn1); // => ["a", "b", "d", "f", "g", "i", "v"]

function fn2(a = (x, y = () => undefined, z) => undefined, [ b, [ d, [ f = 2, [ g = 1 ] = [] ] = [] ] ], { c: { e: { h: { i = 3 } = {} } } }, v) {};
getParams(fn2)l // => ["a", "b", "d", "f", "g", "i", "v"]
```

