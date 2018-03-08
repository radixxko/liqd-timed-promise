# TimedPromise: Node.js class extending standard JavaScript Promises

[![Version npm](https://img.shields.io/npm/v/liqd-timed-promise.svg)](https://www.npmjs.com/package/liqd-timed-promise)
[![Coverage Status](https://coveralls.io/repos/github/radixxko/liqd-timed-promise/badge.svg?branch=master)](https://coveralls.io/github/radixxko/liqd-timed-promise?branch=master)

## Sneak Peek

```js
let data = await new TimedPromise( ( resolve, reject, timeout ) =>
{
  console.log( `Fetch timeout set to ${timeout}ms` );

  fetch('http://example.com/data.json')
    .then( response => response.json() )
    .then( json => resolve({ ok: true, json }) )
    .catch( error => reject({ ok: false, error }) );
})
.timeout( 3000, { ok: false, error: 'fetch-timeouted' })
.catch( error => error );
```

## Motivation

Standard JavaScript [`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) does not provide any support for timeouts - failing the Promise once the timer is elapsed.

## Table of Contents

* [Installing](#installing)

## Installing

```
npm install --save liqd-timed-promise
```
