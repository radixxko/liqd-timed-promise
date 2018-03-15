'use strict';

const Loggers = new Map();

module.exports = class Logger
{
  constructor( id )
  {
    Loggers.set( id, this );

    this.id = id;
    this.logs = [];
  }

  log( ...args )
  {
    this.logs.push({ type: 'log', args });
  }

  warn( ...args )
  {
    this.logs.push({ type: 'warn', args });
  }

  error( ...args )
  {
    this.logs.push({ type: 'error', args });
  }

  dump()
  {
    console.log( '\x1b[35mLogs for ' + this.id + '\x1b[0m\n' );

    for( let log of this.logs )
    {
      if( log.type === 'log' )
      {
        console.log.apply( console, log.args );
      }
      else if( log.type === 'warn' )
      {
          console.warn( '\x1b[33m' + log.args.map( l => l || l.toString() ).join('\n') + '\x1b[0m' );
      }
      else if( log.type === 'error' )
      {
          console.error( '\x1b[31m' + log.args.map( l => l || l.toString() ).join('\n') + '\x1b[0m' );
      }
    }
  }

  static dumpAll()
  {
    let first = true;

    for( let logger of Loggers.values() )
    {
      if( !first )
      {
        console.log('\n------------------------\n');
      }
      first = false;

      logger.dump();
    }
  }
}
