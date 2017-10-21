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