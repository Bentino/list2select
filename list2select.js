(function($) {

var defaults = {
  defaultOption: '— Select an option —',
  tabMode: false,
  tabSelector: ''
};

$.fn.list2select = function(options){

  var settings = $.extend({}, defaults, options );

  return this.each(function(){
  
    var data = $(this).data('list2select');
    if ( !data ) {
    
      // Set state for prevent duplicate initialization
      var state = {};
      $(this).data('list2select', state);
    
      // Construct HTML Select element  
      var select = $('<select />', {
        'class': 'select-dropdown'
      });
      
      // Build an default option
      var defaultOption = $('<option />', {
        'class': 'option default',
        'value': '',
        'selected': 'selected'
      }).text(settings.defaultOption);
      
      select.append(defaultOption);
      
      $(this).find('> li > a').each(function(){
        var option = $('<option />', {
          'class': 'option',
          'value': $(this).attr('href'),
          'data-target': $(this).attr('target')
        }).text($(this).text());
        
        select.append(option);
      });
      
      $(this).hide();
      $(this).parent().prepend(select);
      
      select.on('change', function() {
      
        if(settings.tabMode) {
          
          if($(this).val() != '') {
            $(settings.tabSelector).removeClass('active');
            $($(this).val()).addClass('active');
            
          } else {
            $(settings.tabSelector).first().addClass('active');
          }
          
          
        } else {

          if($(this).find(':selected').data('target')) {
            switch($(this).find(':selected').data('target')) {
              case '_blank': window.open($(this).val(), '_blank'); break;
              case '_self': window.location.href = $(this).val(); break;
            }
          } else {
            window.location.href = $(this).val();
          }
          
        }
        
      });
      
    }
  });
};

})(jQuery);