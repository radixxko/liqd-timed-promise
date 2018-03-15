'use strict';

const fs = require('fs');

describe( 'Tests', ( done ) =>
{
  var files = fs.readdirSync( __dirname + '/tests' );

  for( let file of files )
  {
    describe( file, () =>
    {
      require( __dirname + '/tests/' + file );
    });
  }
});
