# TimedPromise: Node.js class extending standard JavaScript Promises

[![Version npm](https://img.shields.io/npm/v/liqd-timed-promise.svg)](https://www.npmjs.com/package/liqd-timed-promise)
[![Build Status](https://travis-ci.org/radixxko/liqd-timed-promise.svg?branch=master)](https://travis-ci.org/radixxko/liqd-timed-promise)
[![Coverage Status](https://coveralls.io/repos/github/radixxko/liqd-timed-promise/badge.svg?branch=master)](https://coveralls.io/github/radixxko/liqd-timed-promise?branch=master)
[![Dependency Status](https://beta.gemnasium.com/badges/github.com/radixxko/liqd-timed-promise.svg)](https://beta.gemnasium.com/projects/github.com/radixxko/liqd-timed-promise)

## Sneak Peek

1) Converting standard Fetch Promise to TimedPromise with the 3s timeout
```js
let data = await new TimedPromise( fetch('http://example.com/movies.json') )
	.then( response => response.json() )
	.then( json => { return { ok: true, json } })
	.timeout( 3000, { ok: false, error: 'fetch-timeouted' })
	.catch( error => { return { ok: false, error } });
```
2) Creating new TimedPromise with the 3s timeout
```js
let data = await new TimedPromise( ( resolve, reject, timeout ) =>
{
  console.log( `Fetch timeout set to ${timeout}ms` );

  fetch('http://example.com/movies.json')
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
