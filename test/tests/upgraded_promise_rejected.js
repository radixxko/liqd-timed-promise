const TimedPromise = require( '../../lib/timed_promise' );

module.exports.test = ( Logger ) =>
{
  let promise = new Promise( ( resolve, reject, timeout ) =>
  {
    Logger.log( 'Promise created' );

    setTimeout( () =>
    {
      Logger.log( 'Promise resolved' );
      reject( 'Rejected' );
    }, 1000);
  });

  Logger.log( 'TimedPromise created' );

  return new TimedPromise( promise ).timeout( 2000 ).catch( err =>
  {
    Logger.log( 'TimedPromise catched' );

    return 'Catched-'+err;
  });
}

module.exports.expects = 'Catched-Rejected';
