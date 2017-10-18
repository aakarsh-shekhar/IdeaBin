$(document).ready(function() {
  
  $.get('/database/listing', function(listings) {
    
    if (listings.length === 0) {
      $('.listings').append('<p class="no-listings">We couldn\'t find any listings that meet your requirements.</p>');
      return;
    }
    
    listings.forEach(function(l) {
      $('.listings').append('<li data-id="' + l.id + '" data-category="' + l.category + '" data-price="' + l.price + '">' + 
                              '<img src="' + l.image + '">' + 
                              '<div class="details">' + 
                                '<h2>' + l.name + '</h2>' + 
                                '<h3>$' + l.price.toFixed(2) + ' per night</h3>' + 
                                '<p>' + l.description + '</p>' + 
                                '<div class="datepicker"></div>' + 
                              '</div>' + 
                            '</li>');
    });
    
    // Here we introduce the jQuery-UI Datepicker
    // More information here: http://jqueryui.com/datepicker/
    $('.datepicker').datepicker({
      onSelect: function(date) {
        var id = $(this).closest('li').data('id');
        
        listings[id].booked.push(date);
        
        $.post('/book', { id: id, date: date });
      },
      beforeShowDay: function(date) {
        var id        = $(this).closest('li').data('id'),
            dateStr   = $.datepicker.formatDate('mm/dd/yy', date),
            canSelect = listings[id].booked.indexOf(dateStr) < 0;
            
        return [canSelect];
      }
    });
    
    
    setTimeout(function() {  
      // Here we introduce the Isotope Tiling library
      // More information here: http://isotope.metafizzy.co/

      $('.listings').isotope({
        itemSelector: 'li',
        layoutMode: 'fitRows',
        fitRows: {
            gutter: 10
        }
    }); }, 100);
  });

  // Advanced material
  // This is where we setup the room type and price range filtering
  //
  // Note to us: some tricky concepts here. This function is used by a higher order function, and it overrides the "this" keyword.
  //
  // This function returns true if a listing should be shown and false if it should be filtered out.
  function filterListings() {
    var minPrice = parseFloat($('#min-price').val()) || 0;
    var maxPrice = parseFloat($('#max-price').val());
    if (isNaN(maxPrice))
      maxPrice = Infinity;
    
    var price = $(this).data('price');
    var category = $(this).data('category');
    
    var priceGteMin = price >= minPrice;
    var priceLteMax = price <= maxPrice;
    var categoryChecked = document.getElementById( category ).checked;
    
    return priceGteMin && priceLteMax && categoryChecked;
  }
  
  // Filter listings when you check or uncheck a checkbox
  $('.room-type :checkbox').change(function () {
      $('.listings').isotope({
          filter: filterListings
      });
  });
  
  // Validate the inputs making sure min is less than max
  $('.price-range input').on('input', function() {
    var minPrice = parseFloat($('#min-price').val());
    var maxPrice = parseFloat($('#max-price').val());
  
      if (minPrice > maxPrice) {
          if (this.id == 'min-price')
              $('#max-price').val(minPrice);
          else 
              $('#min-price').val(maxPrice);
      }
      
      $('.listings').isotope({
        filter: filterListings
      });
  });
  
});