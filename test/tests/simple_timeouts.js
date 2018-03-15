'use strict';

const assert = require('assert');
const TimedPromise = require( '../../lib/timed_promise' );

it( 'TimedPromise should be resolved', async() =>
{
  let promise = new TimedPromise( ( resolve, reject, timeout ) =>
  {
    resolve( 'Resolved' );
  });

  assert.equal( await promise, 'Resolved', 'TimedPromise not Resolved' );
});

it( 'TimedPromise should be rejected', async() =>
{
  try
  {
    let result = await new TimedPromise( ( resolve, reject, timeout ) =>
    {
      reject( 'Rejected' );
    })
    .timeout( 1000 );
  }
  catch( error )
  {
    assert.equal( error, 'Rejected', 'TimedPromise not rejected' );
  }
});

it( 'TimedPromise should be resolved without triggering timeout', async() =>
{
  let promise = new TimedPromise( ( resolve, reject, timeout ) =>
  {
    resolve( 'Resolved' );
  })
  .timeout( 1000 );

  assert.equal( await promise, 'Resolved', 'TimedPromise not Resolved' );
});

it( 'TimedPromise should be timeouted and throws exception', async() =>
{
  try
  {
    let result = await new TimedPromise( ( resolve, reject, timeout ) =>
    {
      //resolve( 'Resolved' );
    })
    .timeout( 1000 );
  }
  catch( error )
  {
    assert.equal( error, 'timeout', 'TimedPromise not timeouted' );
  }
});

it( 'TimedPromise should be timeouted and catches exception', async() =>
{
  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .timeout( 1000 )
  .catch( error => 'Catched-'+error );

  assert.equal( result, 'Catched-timeout', 'TimedPromise not catched' );
});

it( 'TimedPromise should be timeouted and catches exception with lowest timeout', async() =>
{
  let start = (new Date()).getTime();

  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .timeout( 5000 )
  .timeout( 1000 )
  .timeout( 2000 )
  .catch( error => 'Catched-'+error );

  let elapsed = (new Date()).getTime() - start;

  assert.ok( 950 < elapsed && elapsed < 1050, 'Invalid TimedPromise timeout' );
  assert.equal( result, 'Catched-timeout', 'TimedPromise not catched' );
});
