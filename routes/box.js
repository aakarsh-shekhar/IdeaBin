app.get(  '/box/:id', function( request, response ) {
  var booked   = request.query.booked   === 'true';
  var reviewed = request.query.reviewed === 'true';
  
  var booking_message = booked   && 'Thank you for booking with us. Your host will contact you shortly for confirmation.';
  var review_message  = reviewed && 'Thanks for your review!';
  
  var listing = database.listings[ request.params.id ];
  
  response.render( 'box', {
    listing         : listing,
    booked          : booked,
    reviewed        : reviewed,
    booking_message : booking_message,
    review_message  : review_message,
  });
})

app.post( '/box/:id', function( request, response ) {
  var id      = request.params.id;
  var booking = request.body;
  
  var start = booking.start;
  var end   = booking.end;
  
  database.listings[ id ].bookings.push( [ start, end ] )
  
  response.redirect( '/box/' + id + '?booked=true' )
})