// server.js
// where your node app starts
// First we require all the libraries we want to use
var fs     = require('fs'),
    multer = require('multer'),
    upload = multer({ dest: 'public/images' }),
    app    = setup(),
    database;

// When the browser makes a request at <url>, the chosen template is rendered, with data optionally passed to the template
app.get(  '/', function( request, response ) {
  response.render( 'home' );
})

app.get(  '/box/:id', function( request, response ) {
  var data = {
    listing  : database.listings[ request.params.id ],
    booked   : request.query.booked   === 'true',
    reviewed : request.query.reviewed === 'true',
  }
  response.render( 'box', data );
})
app.post( '/box/:id', function( request, response ) {  
  response.redirect( '/box/' + request.params.id + '?booked=true' )
})

app.get(  '/review/:id', function( request, response ) {
  var data = {
    listing: database.listings[ request.params.id ],
  }
  response.render( 'review', data );
})
app.post( '/review/:id', function( request, response ) {  
  response.redirect( '/box/' + request.params.id + '?reviewed=true')
})

app.get(  '/listings', function( request, response ) {
  var data = { listings: database.listings };
  response.render( 'listings', data )
})

app.get(  '/signup', function( request, response ) {
  response.render( 'signup' );
})
app.post( '/signup', upload.single('image'), function (request, response) {  
  // request.body will have the information the user posted (name, description, price, etc.)
  var listing = request.body;
  
  // request.file has information about the image the user uploaded.
  var imageName = request.file.path + '-' + request.file.originalname;
  fs.rename(request.file.path, imageName);
  
  listing.image   = imageName.substring('public'.length);   // save the image path in our database (and remove 'public' from the beginning of the path)
  listing.id      = database.listings.length;               // assign this listing a unique id
  listing.price   = +listing.price;                         // convert the price from a string to a number
  listing.reviews = [];                                     // initially, no reviews for this listing

  database.listings.push(listing);
  
  response.redirect( '/box/' + listing.id );
});

app.post( '/book', function (request, response) {
  var id   = request.body.id,
      date = request.body.date;
      
  database.listings[id].booked.push(date);
  response.sendStatus(200);
});


function setup() {
  
  var express    = require('express'),
      bodyParser = require('body-parser'),            // This middleware parses posted form data (used to let users post new catbnb listings)
      app        = express();
  
  app.listen( process.env.PORT );
  // Support EJS templates
  app.set( 'view engine', 'ejs' )
  // Use database.json as a database
  app.use( jsonDatabase( 'database.json' ) )
  // Everything in the public/ folder will be made available for download ( Mostly CSS )
  app.use( express.static( 'public' ) );
  // This line allows us to read information encoded in the request body
  app.use( bodyParser.urlencoded( { extended: true } ) );
  
  app.get( '/reset', function(request, response) {
    for (var id in database.listings) {
      database.listings[id].reviews = [];
    }
    response.redirect('/');
  });
  
  return app;
  
  // Load listings database from a JSON file
  function jsonDatabase( filename ) {

    return function( request, response, next ) {
      loadDatabase();
      response.on( 'close', function() { saveDatabase() } );
      next();
    }

    function loadDatabase() {
      database = JSON.parse( fs.readFileSync( filename ) );
    }

    function saveDatabase() {
      fs.writeFileSync( filename, JSON.stringify( database, null, 2 ) );
    }

  }
  
}