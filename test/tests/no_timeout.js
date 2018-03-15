const TimedPromise = require( '../../lib/timed_promise' );

module.exports.test = ( Logger ) =>
{
  return new TimedPromise( ( resolve, reject, timeout ) =>
  {
    Logger.log( 'TimedPromise created' );

    Logger.log( 'TimedPromise resolved' );
    resolve( 'Resolved' );
  });
}

module.exports.expects = 'Resolved';
