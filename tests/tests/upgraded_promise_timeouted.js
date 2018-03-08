const TimedPromise = require( '../../lib/timed_promise' );

module.exports.test = ( Logger ) =>
{
  let promise = new Promise( ( reject, resolve ) =>
  {
    Logger.log( 'Promise created' );

    setTimeout( () =>
    {
      Logger.log( 'Promise resolved' );
      resolve( 'Resolved' );
    }, 2000);
  });

  Logger.log( 'TimedPromise created' );

  return new TimedPromise( promise ).timeout( 1000 ).catch( err =>
  {
    Logger.log( 'TimedPromise catched' );

    return err;
  });
}

module.exports.expects = 'timeout';
