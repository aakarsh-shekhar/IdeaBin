// server.js
// where your node app starts
// First we require all the libraries we want to use

var express      = require('express');
var bodyParser   = require('body-parser'); // This middleware parses posted form data (used to let users post new catbnb listings)
var requireGlob  = require('require-glob');

global.app       = express();
global.database  = {};

require( './lib/jsonDatabase' )( 'database.json' );
  
app.listen( process.env.PORT );
// Support EJS templates
app.set( 'view engine', 'ejs' )
// Everything in the public/ folder will be made available for download ( Mostly CSS )
app.use( express.static( 'public' ) );
// This line allows us to read information encoded in the request body
app.use( bodyParser.urlencoded( { extended: true } ) );

requireGlob( './controllers/*' )