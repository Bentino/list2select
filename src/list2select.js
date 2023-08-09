(function($) {

var defaults = {
  nullOption: false,
  nullOptionLabel: '— Select an option —',
  tabMode: false,
  tabSelector: '',
  toggleDisplayWidth: 'md',
  insertBefore: false,
  placeIn: '',
  childSelector: 'li',
  customClass: ''
};

var scrollbarWidth = function getScrollBarWidth() {
	if($(document).height() > $(window).height()){
		$('body').append('<div id="fakescrollbar" style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"></div>');
		fakeScrollBar = $('#fakescrollbar');
		fakeScrollBar.append('<div style="height:100px;">&nbsp;</div>');
		var w1 = fakeScrollBar.find('div').innerWidth();
		fakeScrollBar.css('overflow-y', 'scroll');
		var w2 = $('#fakescrollbar').find('div').html('html is required to init new width.').innerWidth();
		fakeScrollBar.remove();
		return (w1-w2);
	}
	return 0;
}

$.fn.list2select = function(options){

  var settings = $.extend({}, defaults, options );

  return this.each(function(){
    var viewport = $(window);
    var html_list = $(this);
    var data = $(this).data('l2s');
    
    if ( !data ) {
    
      // Set state for prevent duplicate initialization
      var state = {'init':true};
      var display = $(this).css('display');
      var original_name = 'l2s-list-' + display + '-' + defaults.toggleDisplayWidth + ' ' + settings.customClass;
      $(this).data('l2s', state);
      $(this).addClass(original_name);
    
      // Construct HTML Select element  
      var select = $('<select />', {
        'class': 'l2s-select-' + display + '-' + defaults.toggleDisplayWidth + ' ' + settings.customClass
      });
      
      // Build an null option
      if(settings.nullOption) {
        var nullOption = $('<option />', {
          'class': 'option default',
          'value': '',
          'selected': 'selected'
        }).text(settings.nullOptionLabel);
        select.append(nullOption);
      }
      
      $(this).find(settings.childSelector).each(function(){
        
        var link = $(this).find('a');
        var linkURL = link.attr('href');
        
        var currentURL = window.location.href;
        if(currentURL.match(/\?./)) {
          currentURL = currentURL.split('?')[0];
        }
        var pattern = '(http:\/\/' + window.location.hostname + '\/)';
        var pattern_object = new RegExp(pattern);
        
        // If link value is not full URL, the script will convert into full URL
        if(!linkURL.match(pattern_object)) {
          linkURL = window.location.protocol + '//' + window.location.hostname + link.attr('href');
        }

        var selected = false;
        if(currentURL == linkURL) {
          selected = true;
        }
        
        var option = $('<option />', {
          'class': 'option',
          'value': link.attr('href'),
          'selected': selected,
          'data-target': link.attr('target')
        }).text(link.text());
        
        select.append(option);
      });
      
      if(settings.insertBefore) {
        if(settings.placeIn) {
          $(document).find(settings.placeIn).prepend(select);
        } else {
          html_list.parent().prepend(select);
        }
      } else {
        if(settings.placeIn) {
          $(document).find(settings.placeIn).append(select);
        } else {
          html_list.parent().append(select);
        }
      }
      
      select.on('change', function(e) {
        e.preventDefault();
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