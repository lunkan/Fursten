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