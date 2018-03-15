# TimedPromise: ECMAScript 6+ class extending standard JavaScript Promises

[![Version npm](https://img.shields.io/npm/v/liqd-timed-promise.svg)](https://www.npmjs.com/package/liqd-timed-promise)
[![Build Status](https://travis-ci.org/radixxko/liqd-timed-promise.svg?branch=master)](https://travis-ci.org/radixxko/liqd-timed-promise)
[![Coverage Status](https://coveralls.io/repos/github/radixxko/liqd-timed-promise/badge.svg?branch=master)](https://coveralls.io/github/radixxko/liqd-timed-promise?branch=master)
[![Dependency Status](https://beta.gemnasium.com/badges/github.com/radixxko/liqd-timed-promise.svg)](https://beta.gemnasium.com/projects/github.com/radixxko/liqd-timed-promise)

## Sneak Peek

This library extends standard ECMAScript Promises with the timeout functionality and works in any browser supporting Promises or Node.js environment.

1. Converting standard Fetch Promise to TimedPromise with the 3s timeout
```js
let data = await new TimedPromise( fetch('http://example.com/movies.json') )
	.then( response => response.json() )
	.then( json => { return { ok: true, json } })
	.timeout( 3000, { ok: false, error: 'fetch-timeouted' })
	.catch( error => { return { ok: false, error } });
```
2. Creating new TimedPromise with the 3s timeout
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

Standard JavaScript [`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) does not provide any support for timeouts - failing the Promise once the timer is elapsed. There are many solutions how to simulate such functionality - for example creating new Promise with the reject callback triggered by the [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function or using [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) method for the original Promise and a new Promise resolved by the [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function.

## Table of Contents

* [Installing](#installing)
* [Class: TimedPromise](#class-timedpromise-extends-promise)
	+ [constructor( executor )](#new-timedpromise-executor)

## Installing

```
npm install --save liqd-timed-promise
```

## Class: TimedPromise extends Promise

### new TimedPromise( executor )

- `executor` {Function|Promise}

### TimedPromise.timeout( timeout_ms[, reason = 'timeout'[, catchable_by_parent = false]] )

- `timeout_ms` {Number} Timeout for the Promise in miliseconds
- `reason` {Any} Exception thrown by the Promise when it is not resolved within a timeout
	- defaults to {String} 'timeout'
- `catchable_by_parent` {Boolean} Determines whether a timeout exception can be catched and resolved by a preceding catch in the Promise chain

Returns `this`.

### TimedPromise.created()

Returns a number representing the milliseconds elapsed between 1 January 1970 00:00:00 UTC and the TimedPromise creation.

### TimedPromise.elapsed()

Returns a number representing the milliseconds elapsed since the TimedPromise creation.

### TimedPromise.remaining()

Returns a number representing the milliseconds remaining until the TimedPromise timeout.

### TimedPromise.then( onFulfilled[, onRejected] )

Returns new TimedPromise

```js
p.then( onFulfilled[, onRejected] );

p.then( ( value, remaining_ms ) =>
{
	// fulfillment
}, ( reason, remaining_ms ) =>
{
	// rejection
});
```

### TimedPromise.catch( onRejected] )

Returns new TimedPromise

```js
p.catch( onRejected );

p.catch( ( reason, remaining_ms ) =>
{
	// rejection
});
```
