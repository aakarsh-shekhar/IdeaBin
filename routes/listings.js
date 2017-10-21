app.get(  '/listings', function( request, response ) {
  var data = { listings: database.listings };
  response.render( 'listings', data )
})