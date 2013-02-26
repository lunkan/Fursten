(function ($) {
	
	var TableSelector = (function(el) {
		
		// private static
	    //var nextId = 1;
		
		var cls = function(el) {
			
			var $tableElement = $(el);
			var selectedElement = null;
			
			this.getTest = function() {
				return "working";
			};
			
			this.getSelected = function() {
				return selectedElement;
			};
			
			this.setSelected = function(element) {
				
				if(selectedElement)
					$(selectedElement).removeClass('selected');
				
				selectedElement = element;
				$(selectedElement).addClass('selected');
				$tableElement.trigger('selectChanged');
			};
		};
		
		return cls;
	})();
	
	$.fn.selectableTable = function () {
		
		return this.each(function () {
			
			var tableSelector = new TableSelector(this);
			
			$(this).find('tbody tr').each(function() {
				
				var handler = tableSelector;
				
				$(this).click(function () {
					handler.setSelected(this);
				});
			});
        });
    };

 })(jQuery);