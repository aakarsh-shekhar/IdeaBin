app.get(  '/review/:id', function( request, response ) {
  var data = {
    listing: database.listings[ request.params.id ],
  }
  response.render( 'review', data );
})

app.post( '/review/:id', function( request, response ) {
  var id     = request.params.id;
  var review = request.body;
  
  database.listings[ id ].reviews.unshift( review )

  response.redirect( '/box/' + id + '?reviewed=true')
});