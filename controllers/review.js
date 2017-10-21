app.get(  '/review/:id', function( request, response ) {
  var data = {
    listing: database.listings[ request.params.id ],
  }
  response.render( 'review', data );
})

app.post( '/review/:id', function( request, response ) {  
  response.redirect( '/box/' + request.params.id + '?reviewed=true')
})