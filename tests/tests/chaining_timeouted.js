const TimedPromise = require( '../../lib/timed_promise' );

module.exports.test = async( Logger ) =>
{
  const promise = new TimedPromise( ( resolve, reject, timeout ) =>
  {
    Logger.log( `TimedPromise created with ${timeout} ms timeout` );

    setTimeout( () => { resolve( 3 ); }, 1500 );
  });

  let returned =  promise
  .timeout( 5000, '5000' )
  .then( ( value, timeout ) =>
  {
    Logger.log( `1st Then value = ${value}, ${timeout} ms timeout` );

    return value + 1;
  })
  .timeout( 3000, '3000' )
  .then( ( value, timeout ) =>
  {
    Logger.log( `2nd Then value = ${value}, ${timeout} ms timeout` );

    return value + 2;
  })
  .timeout( 1000, '1000' )
  .catch( ( error, timeout ) =>
  {
    Logger.log( `Catch error = ${error}, ${timeout} ms timeout` );

    return 'Catched-'+error;
  });

  return returned;
}

module.exports.expects = 'Catched-1000';
