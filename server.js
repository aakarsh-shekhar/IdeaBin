// server.js
// where your node app starts
// First we require all the libraries we want to use
var fs         = require('fs'),
    http       = require('http'),
    express    = require('express'),
    bodyParser = require('body-parser'),            // This middleware parses posted form data (used to let users post new catbnb listings)
    multer     = require('multer');                // this middleware allows users to post files (like images)

// Now we configure these libraries
var upload  = multer({ dest: 'public/images' }),
    app     = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Start the server
var server  = http.createServer(app);
server.listen(process.env.PORT);

///*

// Everything in the front-end's public/ folder will be made available for download to the client
app.use(express.static('public'));

// When the client connects to <url>, they are shown the webpage /views/home.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/listing.html');
});


// Load listings database from a JSON file
var database;
function loadDatabase() {
  database = JSON.parse(fs.readFileSync('database.json'));
}

function saveDatabase() {
  fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
}

loadDatabase();

app.get("/listings", function( request, response ) {
  var html = ''
  
  html += '<html><body>'
  html += '<table>'
  
  html += '<thead><tr><th>September</th></tr></thead>'
  html += '<tbody>'
  
  for ( var i = 0; i < database.listings.length; i ++) {
    html += '<tr>'
  }

  html += '</tbody></table>'
    
  html += '</body></html>'

  response.send( html )
})

// When the client connects to /database/listing, they are sent the text for all items in the listings database
app.get("/database/listing", function (request, response) {
  loadDatabase();  // refresh from file in case it was modified directly
  response.send(database.listings);
});

app.post("/book", function (request, response) {
  var id = request.body.id,
      date = request.body.date;
      
  database.listings[id].booked.push(date);
  saveDatabase();

  response.sendStatus(200);
});

app.post('/unbook', function(request, response) {
  // As an exercise, implement this method.
  // You can use array.contains(item) and array.remove(item) functions to help. (These are helper functions we added, not native JavaScript.)

});

app.get('/reset', function(request, response) {
  for (var id in database.listings) {
    database.listings[id].booked = [];
  }
  saveDatabase();
  response.redirect('/');
});


// Advanced material ahead
// There be dragons
//
// Configure file uploading

// This method allows users to post new listings.
// When the client posts information to /database/listing, we add the new listing to the database and respond with the EVERYTHING WENT OK CODE (200)
app.post("/database/listing", upload.single('image'), function (request, response) {
  
  // request.body will have the information the user posted (name, description, price, etc.)
  var listing = request.body;
  
  // request.file has information about the image the user uploaded.
  var imageName = request.file.path + '-' + request.file.originalname;
  fs.rename(request.file.path, imageName);
  
  listing.image = imageName.substring('public'.length);   // save the image path in our database (and remove 'public' from the beginning of the path)
  listing.id = database.listings.length;                  // assign this listing a unique id
  listing.price = +listing.price;                         // convert the price from a string to a number
  listing.booked = [];                                    // initially, no dates are booked for this listing
  
  database.listings.push(listing);
  saveDatabase();
  
  response.redirect('back');
});

// Helper methods. We won't be teaching these next two lines
Array.prototype.contains = function(item) { return this.indexOf(item) >= 0; };
Array.prototype.remove = function(item) { if (this.contains(item)) this.splice(this.indexOf(item), 1); };
//*/