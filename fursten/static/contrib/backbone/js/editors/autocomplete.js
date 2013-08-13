;(function(root) {
	
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	editors.Autocomplete = editors.Text.extend({
	
		render: function() {
		    
			this.setValue(this.value);
			this.$el.autocomplete({
				minLength: 2,
				delay: 250,
				source: this.getSourceProxy({
					url:this.schema.options.url
				}),
				select: this.getSelectFunction({})
			});
	
		    return this;
		},
		getSelectFunction: function(options) {
			return function( event, ui ) {
		    	//Log
		    }
		},
		getSourceProxy: function(options) {
			
			var sourceUrl = options.url;
			return function(request, response) {
				$.ajax({
					dataType: "json",
					url: sourceUrl,
					async: false,
					success: function(data) {
						response(data);
						return;
					}
		    	});
			};
		},
		getValue: function() {     
			var value = this.$el.val();
			return value;
		},
		setValue: function(value) {
	    	editors.Text.prototype.setValue.call(this, value);
	    }
	});
	
	return Backbone;
	
})(this);