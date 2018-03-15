'use strict';

const assert = require('assert');
const TimedPromise = require( '../../lib/timed_promise' );

const sleep = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) );
const approximately = ( a, b, epsilon ) => ( Math.abs( a - b ) < epsilon );

it( 'TimedPromise properties should be matching', async() =>
{
  let start = (new Date()).getTime();
  let promise_timeout_ms, timeouted;

  let promise = new TimedPromise( ( resolve, reject, remaining_ms ) =>
  {
    assert.ok( approximately( remaining_ms, 1500, 10 ), 'Invalid TimedPromise remaining_ms time' );

    promise_timeout_ms = remaining_ms;
  });

  assert.ok( approximately( promise.created(), start, 10 ), 'Invalid TimedPromise starting created time ' + promise.created() );
  assert.ok( approximately( promise.elapsed(), 0, 10 ), 'Invalid TimedPromise starting elapsed time ' + promise.elapsed() );
  assert.ok( promise.remaining() === Infinity, 'Invalid TimedPromise starting remaining time ' + promise.remaining() );

  promise = promise.timeout(1500);
  promise.catch( e => { timeouted = (new Date()).getTime(); } );

  while( !timeouted )
  {
    await sleep( 100 );

    let now = (new Date()).getTime();
    let [ created, elapsed, remaining ] = [ promise.created(), promise.elapsed(), promise.remaining() ];

    assert.ok( approximately( created, start, 10 ), 'Invalid TimedPromise created time ' + created );
    assert.ok( approximately( elapsed, now - start, 10 ), 'Invalid TimedPromise elapsed time ' + elapsed );
    assert.ok( elapsed >= promise_timeout_ms ? approximately( remaining, 0, 10 ) : approximately( remaining, promise_timeout_ms - ( now - start ), 10 ), 'Invalid TimedPromise remaining time ' + remaining + ' ' + elapsed + ' ' + promise_timeout_ms );
  }

});
