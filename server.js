// server.js
// where your node app starts

// First we require all the libraries we want to use

// Express is the framework that allows us to accept requests and generate responses
var express      = require('express');
// BodyParser lets us read form data
var bodyParser   = require('body-parser');
// RequireGlob lets us import all our routes in 1 command
var requireGlob  = require('require-glob');
// This module allows us to use a JSON file as a database
var db           = require('./lib/jsonDatabase');

// Here we define the application instance
global.app       = express();
// And here we define the database connection
global.database  = db( 'database.json' );

// Now we listen for incoming requests
app.listen( process.env.PORT );
// Support EJS templates http://ejs.co
app.set( 'view engine', 'ejs' )
// Make the /public folder available for download
app.use( express.static( 'public' ) );
// Read information encoded in the request body ( Mostly forms )
app.use( bodyParser.urlencoded( { extended: true } ) );

// Load all the routes
requireGlob( './routes/*' )