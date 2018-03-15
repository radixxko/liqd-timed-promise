'use strict';

const nativePromiseExecutorRE = /^function[\sA-Za-z0-9]*\(\s*\)\s*{\s*\[\s*native\s+code\s*\]\s*}\s*$/;

function isNativePromiseExecutor( executor )
{
  return nativePromiseExecutorRE.test( executor.toString() );
}

class TimedPromise extends Promise
{
  constructor( executor )
  {
    let timed_promise =
    {
      parent: null,
      created: (new Date()).getTime(),
      timeout: Infinity,
      timer: null,
      pending: true,
      resolve: null,
      reject: null
    };

    // TODO:  probably schedule resolve, reject callbacks to nextTick for nativePromiseExecutors in future releases
    //        to propagate timeout to parents, verify that catchable_by_parent is still working

    super( ( resolve, reject ) =>
    {
      timed_promise.resolve = ( value ) =>
      {
        if( timed_promise.pending )
        {
          timed_promise.pending = false;

          if( timed_promise.timer )
          {
            clearTimeout( timed_promise.timer );
            timed_promise.timer = null;
          }

          return resolve( value );
        }
      };
      timed_promise.reject = ( reason ) =>
      {
        if( timed_promise.pending )
        {
          timed_promise.pending = false;

          if( timed_promise.timer )
          {
            clearTimeout( timed_promise.timer );
            timed_promise.timer = null;
          }

          return reject( reason );
        }
      };

      if( isNativePromiseExecutor( executor ) )
      {
        executor( timed_promise.resolve, timed_promise.reject );
      }
      else if( executor instanceof Promise )
      {
        executor.then( timed_promise.resolve, timed_promise.reject );
      }
      else
      {
        process.nextTick( () =>
        {
          executor( timed_promise.resolve, timed_promise.reject, this.remaining() )
        });
      }
    });

    this._timed_promise = timed_promise;
  }

  timeout( timeout_ms, reason = 'timeout', catchable_by_parent = false )
  {
    const timed_promise = this._timed_promise;

    if( timed_promise && timed_promise.pending && this.remaining() > timeout_ms )
    {
      if( catchable_by_parent && timed_promise.parent && timed_promise.parent.timeout )
      {
        timed_promise.parent.timeout( timeout_ms, reason, catchable_by_parent );
      }

      timed_promise.timeout = (new Date()).getTime() + timeout_ms;

      if( timed_promise.timer )
      {
        clearTimeout( timed_promise.timer );
      }

      timed_promise.timer = setTimeout( () =>
      {
        timed_promise.timer = null;
        timed_promise.reject( reason );
      }, timeout_ms );

      if( !catchable_by_parent && timed_promise.parent && timed_promise.parent.timeout )
      {
        timed_promise.parent.timeout( timeout_ms, reason, catchable_by_parent );
      }
    }

    return this;
  }

  created()
  {
    return this._timed_promise.created;
  }

  elapsed()
  {
    return (new Date()).getTime() - this._timed_promise.created;
  }

  remaining()
  {
    const timed_promise = this._timed_promise;

    if( timed_promise.pending )
    {
      if( timed_promise.timeout !== Infinity )
      {
        return Math.max( 0, timed_promise.timeout - (new Date()).getTime() );
      }
      else{ return Infinity; }
    }
    else{ return 0; }
  }

  then( onFulfilled, onRejected )
  {
    const then_promise = super.then(
      ( !onFulfilled || isNativePromiseExecutor( onFulfilled ) ) ? onFulfilled : ( value ) => onFulfilled( value, this.remaining() ),
      ( !onRejected || isNativePromiseExecutor( onRejected ) ) ? onRejected : ( reason ) => onRejected( reason, this.remaining() )
    );

    then_promise._timed_promise.parent = this;

    return then_promise;
  }

  catch( onRejected )
  {
    const catch_promise = super.catch(
      ( !onRejected || isNativePromiseExecutor( onRejected ) ) ? onRejected : ( reason ) => onRejected( reason, this.remaining() )
    );

    catch_promise._timed_promise.parent = this;

    return catch_promise;
  }
}

module.exports = TimedPromise;
