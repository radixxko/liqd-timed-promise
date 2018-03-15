const TimedPromise = require( '../../lib/timed_promise' );

module.exports.test = ( Logger ) =>
{
  return new TimedPromise( ( resolve, reject, timeout ) =>
  {
    Logger.log( 'TimedPromise created' );

    setTimeout( () =>
    {
      Logger.log( 'TimedPromise resolved' );
      resolve( 'Resolved' );
    }, 2000);
  })
  .timeout( 1000 )
  .catch( err =>
  {
    Logger.log( 'TimedPromise catched' );

    return 'Catched-'+err;
  });
}

module.exports.expects = 'Catched-timeout';
