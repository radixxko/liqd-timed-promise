'use strict';

const assert = require('assert');
const TimedPromise = require( '../../lib/timed_promise' );

it( 'Upgraded TimedPromise should be resolved', async() =>
{
  let promise = new TimedPromise( new Promise( ( resolve, reject ) =>
  {
    resolve( 'Resolved' );
  }));

  assert.equal( await promise, 'Resolved', 'TimedPromise not Resolved' );
});

it( 'TimedPromise should be rejected', async() =>
{
  try
  {
    let result = await new TimedPromise( new Promise( ( resolve, reject ) =>
    {
      reject( 'Rejected' );
    }))
    .timeout( 1000 );
  }
  catch( error )
  {
    assert.equal( error, 'Rejected', 'TimedPromise not rejected' );
  }
});

it( 'Upgraded TimedPromise should be resolved without triggering timeout', async() =>
{
  let promise = new TimedPromise( new Promise( ( resolve, reject ) =>
  {
    resolve( 'Resolved' );
  }))
  .timeout( 1000 );

  assert.equal( await promise, 'Resolved', 'TimedPromise not Resolved' );
});

it( 'Upgraded TimedPromise should be timeouted and throws exception', async() =>
{
  try
  {
    let result = await new TimedPromise( new Promise( ( resolve, reject ) =>
    {
      //resolve( 'Resolved' );
    }))
    .timeout( 1000 );
  }
  catch( error )
  {
    assert.equal( error, 'timeout', 'TimedPromise not timeouted' );
  }
});

it( 'Upgraded TimedPromise should be timeouted and catches exception', async() =>
{
  let result = await new TimedPromise( new Promise( ( resolve, reject ) =>
  {
    //resolve( 'Resolved' );
  }))
  .timeout( 1000 )
  .catch( error => 'Catched-'+error );

  assert.equal( result, 'Catched-timeout', 'TimedPromise not catched' );
});
