'use strict';

module.exports = class TimedPromise extends Promise
{
  constructor( executor )
  {
    if( executor.toString().replace(/\s+/g,'') === 'function(){[nativecode]}' )
    {
      super( executor );
    }
    else
    {
      let timed_promise =
      {
        created: process.hrtime(),
        pending: true,
        timeout: null,
        timeout_ms: Infinity,
        resolve: null,
        reject: null
      };

      super( ( resolve, reject ) =>
      {
        timed_promise.resolve = ( value ) =>
        {
          if( timed_promise.pending )
          {
            timed_promise.pending = false;

            if( timed_promise.timeout )
            {
              clearTimeout( timed_promise.timeout );
              timed_promise.timeout = null;
            }

            resolve( value );
          }
        };
        timed_promise.reject = ( value ) =>
        {
          if( timed_promise.pending )
          {
            timed_promise.pending = false;

            if( timed_promise.timeout )
            {
              clearTimeout( timed_promise.timeout );
              timed_promise.timeout = null;
            }

            reject( value );
          }
        };

        if( executor instanceof Promise )
        {
          executor.then( timed_promise.resolve, timed_promise.reject );
        }
        else
        {
          process.nextTick( () => executor( timed_promise.resolve, timed_promise.reject, timed_promise.timeout_ms ) );
        }
      });

      this._timed_promise = timed_promise;
    }
  }

  timeout( ms, error = 'timeout' )
  {
    const timed_promise = this._timed_promise;

    if( timed_promise && timed_promise.pending && timed_promise.timeout_ms > ms )
    {
      timed_promise.timeout_ms = ms;

      if( timed_promise.timeout )
      {
        clearTimeout( timed_promise.timeout );
      }

      timed_promise.timeout = setTimeout( () =>
      {
        timed_promise.timeout = null;
        timed_promise.reject( error );
      }, ms );
    }

    return this;
  }

  elapsed()
  {
    let elapsed = process.hrtime( this._timed_promise.created );

    return ( elapsed[0] * 1e3 + elapsed[1] / 1e6 );
  }

  remaining()
  {
    const timed_promise = this._timed_promise;

    if( timed_promise.pending )
    {
      if( timed_promise.timeout_ms !== Infinity )
      {
        return Math.max( 0, timed_promise.timeout_ms - this.elapsed() );
      }
      else{ return Infinity; }
    }
    else{ return 0; }
  }

  then( success, fail )
  {
    return super.then( success, fail );
  }

  catch( fail )
  {
    return super.catch( fail );
  }
}
