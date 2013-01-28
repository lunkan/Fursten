;(function(root) {
	
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	editors.Autocomplete = editors.Text.extend({
	
		render: function() {
		    
			this.setValue(this.value);
			this.$el.autocomplete({
				source: this.schema.options.url,
				minLength: 2,
			    select: function( event, ui ) {
			    	/*log*/
			    }
			});
	
		    return this;
		  }
	
		});
	
	return Backbone;
	
})(this);