'use strict';

const fs = require('fs');

process.on( 'unhandledRejection', ( rejection ) =>
{
  //console.log( 'unhandledRejection', rejection, '\n'+(new Error()).stack.split(/\s*\n\s*/).filter( ( l, i ) => i > 1 && l ).join('\n') );
  console.log( 'unhandledRejection', rejection );
})

fs.readdir( __dirname + '/tests', async( err, files ) =>
{
  if( !err )
  {
    const Logger = require('./logger');
    const tests = [];

    for( let file of files )
    {
      //if( file !== 'timeout_timeouted.js' ){ continue; }

      let logger = new Logger( file );
      let test = require( __dirname + '/tests/' + file );

      tests.push(
      {
        name:     file,
        test:     test.test( logger ),
        expects:  test.expects,
        logger
      })
    }

    const results = await Promise.all( tests.map( t => t.test ) );

    for( let i = 0; i < tests.length; ++i )
    {
      if( tests[i].expects === results[i] )
      {
        console.log( '\x1b[42m\x1b[30m OK  ✓ \x1b[0m \x1b[32mTest "' + tests[i].name + '" successful\x1b[0m' );
      }
      else
      {
        console.log( '\x1b[41m\x1b[30m ERROR \x1b[0m \x1b[31mTest "' + tests[i].name + '" failed\x1b[0m' );
        console.log( '\x1b[31m        Expects : ' + ( tests[i].expects || tests[i].expects.toString() ) + '\x1b[0m' );
        console.log( '\x1b[31m        Result  : ' + ( results[i] || results[i].toString() ) + '\x1b[0m' );

        tests[i].logger.dump();
      }
    }
  }
  else
  {
    console.error( err );
  }
});
