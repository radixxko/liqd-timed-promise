'use strict';

const assert = require('assert');
const TimedPromise = require( '../../lib/timed_promise' );

it( 'TimedPromise should be resolved', async() =>
{
  let promise = new TimedPromise( ( resolve, reject, timeout ) =>
  {
    resolve( 'Resolved' );
  });

  assert.equal( await promise
    .then( v => v + '-then_1' )
    .catch( e => e )
    .catch()
    .timeout( 2000 )
    .then( v => v + '-then_2' )
    .catch( e => e ),
  'Resolved-then_1-then_2', 'TimedPromise not Resolved' );
});

it( 'TimedPromise should be rejected', async() =>
{
  let promise = new TimedPromise( ( resolve, reject, timeout ) =>
  {
    reject( 'Rejected' );
  });

  assert.equal( await promise
    .then( v => v + '-then_1' )
    .catch( e => e )
    .timeout( 2000 )
    .then( v => v + '-then_2' )
    .catch( e => e ),
  'Rejected-then_2', 'TimedPromise not Rejected' );
});
