var fs       = require('fs');
var multer   = require('multer');
var upload   = multer({ dest: 'public/images' });

app.get(  '/signup', function( request, response ) {
  response.render( 'signup' );
})

app.post( '/signup', upload.single('image'), function (request, response) {  
  // request.body will have the information the user posted (name, description, price, etc.)
  var listing = request.body;

  // request.file has information about the image the user uploaded.
  if ( request.file ) {
    var imageName = request.file.path + '-' + request.file.originalname;
    fs.rename(request.file.path, imageName);
    listing.image   = imageName.substring('public'.length);   // save the image path in our database (and remove 'public' from the beginning of the path)
  }

  listing.id       =  database.listings.length;               // assign this listing a unique id
  listing.price    =  +listing.price;                         // convert the price from a string to a number
  listing.reviews  =  listing.bookings  =  [];                // initially, no reviews or bookings for this listing

  database.listings.push( listing );

  response.redirect( '/box/' + listing.id );
});