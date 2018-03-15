const TimedPromise = require( '../../lib/timed_promise' );

module.exports.test = ( Logger ) =>
{
  return new TimedPromise( ( resolve, reject, timeout ) =>
  {
    Logger.log( 'TimedPromise created' );

    Logger.log( 'TimedPromise resolved' );
    resolve( 'Resolved' )
  })
  .then( ( value, timeout ) =>
  {
    throw 'Error';
  })
  .then( ( value, timeout ) =>
  {
    return 'Then';
  })
  .timeout( 1000 )
  .catch( err =>
  {
    Logger.log( 'TimedPromise catched' );

    return 'Catched-'+err;
  });
}

module.exports.expects = 'Catched-Error';
