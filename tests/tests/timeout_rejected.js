const TimedPromise = require( '../../lib/timed_promise' );

module.exports.test = ( Logger ) =>
{
  return new TimedPromise( ( resolve, reject, timeout ) =>
  {
    Logger.log( 'TimedPromise created' );

    Logger.log( 'TimedPromise rejected' );
    reject( 'Rejected' );
  })
  .timeout( 1000 )
  .catch( err =>
  {
    Logger.log( 'TimedPromise catched' );

    return err;
  });
}

module.exports.expects = 'Rejected';
