'use strict';

const assert = require('assert');
const TimedPromise = require( '../../lib/timed_promise' );

it( 'TimedPromise should be timeouted with default rejection', async() =>
{
  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .timeout( 1000 )
  .catch( e => e );

  assert.equal( result, 'timeout', 'Invalid TimedPromise rejection' );
});

it( 'TimedPromise should be timeouted with string rejection', async() =>
{
  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .timeout( 1000, 'string' )
  .catch( e => e );

  assert.equal( result, 'string', 'Invalid TimedPromise rejection' );
});

it( 'TimedPromise should be timeouted with number rejection', async() =>
{
  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .timeout( 1000, 42 )
  .catch( e => e );

  assert.equal( result, 42, 'Invalid TimedPromise rejection' );
});

it( 'TimedPromise should be timeouted with object rejection', async() =>
{
  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .timeout( 1000, { ok: false, error: 'timeout' } )
  .catch( e => e );

  assert.deepStrictEqual( result, { ok: false, error: 'timeout' }, 'Invalid TimedPromise rejection' );
});

it( 'TimedPromise should not be catchable by parent', async() =>
{
  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .then( v => v )
  .catch( e => 'Catched-by-parent-'+e )
  .timeout( 1000, 'timeout', false )
  .catch( e => e );

  assert.deepStrictEqual( result, 'timeout', 'Invalid TimedPromise rejection' );
});

it( 'TimedPromise should be catchable by parent', async() =>
{
  let result = await new TimedPromise( ( resolve, reject, timeout ) =>
  {
    //resolve( 'Resolved' );
  })
  .then( v => v )
  .catch( e => 'Catched-by-parent-'+e )
  .timeout( 1000, 'timeout', true )
  .catch( e => e );

  if( parseInt( process.version.match(/^v([0-9]+)/)[1] ) >= 11 )
  {
      assert.deepStrictEqual( result, 'Catched-by-parent-timeout', 'Invalid TimedPromise rejection' );
  }
  else
  {
      // TODO not working in nodeJS < 11, resolve
      assert.deepStrictEqual( result, 'timeout', 'Invalid TimedPromise rejection' );
  }
});
