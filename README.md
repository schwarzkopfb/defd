[![view on npm](http://img.shields.io/npm/v/defd.svg?style=flat-square)](https://www.npmjs.com/package/defd)
[![downloads per month](http://img.shields.io/npm/dm/defd.svg?style=flat-square)](https://www.npmjs.com/package/defd)
[![node version](https://img.shields.io/badge/node-%3E=4-brightgreen.svg?style=flat-square)](https://nodejs.org/download)
[![build status](https://img.shields.io/travis/schwarzkopfb/defd.svg?style=flat-square)](https://travis-ci.org/schwarzkopfb/defd)
[![test coverage](https://img.shields.io/coveralls/schwarzkopfb/defd.svg?style=flat-square)](https://coveralls.io/github/schwarzkopfb/defd)
[![license](https://img.shields.io/npm/l/defd.svg?style=flat-square)](https://github.com/schwarzkopfb/defd/blob/master/LICENSE)

# Deferred

Tiny extension for native Promises to make them more suitable for Node core APIs.<br/>
The package exposes a subclass of the built-in `Promise`, which extends that with the following four methods.

## `new Deferred([executor])`

Unlike `Promise`, `Deferred` does not require an executor function for instantiation, because it makes possible to
resolve or reject the instance from outside the executor's scope.

```js
const d1 = new Deferred,
      d2 = new Deferred(executor)

d1.resolve('sun is shining')
      
function executor(resolve, reject) {
    reject('baby is crying') // same as d2.reject(...)
}

d1.then(result => console.log('success:', result))
d2.catch(error => console.error('error:', error))
```

Output:

```
success: sun is shining
error: baby is crying
```

## `deferred.resolve(value)`

Resolve the deferred instance.

## `deferred.reject(reason)`

Reject the deferred instance.

## `deferred.done(callback)`

Attach an error-first callback to the instance. It will be fired once the instance resolves _or_ rejects.

```js
const d1 = new Deferred,
      d2 = new Deferred
      
function handler(err, result) {
    if (err)
        console.error('error:', err)
    else
        console.log('success:', result)
}

d1.done(handler)
d2.done(handler)

d1.resolve('your pizza order has arrived')
d2.reject('something exploded')
```

Output:

```
success: your pizza order has arrived
error: something exploded
```

## `deferred.callback()`

Generate an error-first callback which will resolve _or_ reject the instance based on the first parameter passed to it.
  
```js
const d1 = new Deferred,
      d2 = new Deferred,
      cb1 = d1.callback(),
      cb2 = d2.callback()
      
d1.then(result => console.log('success:', result))
d2.catch(error => console.error('error:', error))

cb1(null, 'your cat is purring')
cb2('coffee machine is out of order')
```

Output:

```
success: your cat is purring
error: coffee machine is out of order
```

## Installation

With npm:

    npm install defd

## Tests

Run unit tests:

    npm test

Run unit tests and create coverage report:

    npm run cover

## License

[MIT](/LICENSE)