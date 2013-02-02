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
			return 3;//"Hej du glade";
		},
		    
	    setValue: function(value) {
	      
	    	value = "Hej du glade";
	    		/*(function() {
		        if (_.isNumber(value)) return value;

		        if (_.isString(value) && value !== '') return parseFloat(value, 10);

		        return null;
		      })();

		      if (_.isNaN(value)) value = null;*/
		      
		      editors.Text.prototype.setValue.call(this, value);
	    }
	});
	
	return Backbone;
	
})(this);