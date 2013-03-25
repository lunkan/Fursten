;(function(root) {
	
	var resourceAutoIndex = null;
	
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	editors.AutocompleteResource = editors.Autocomplete.extend({
	
		getIndex: function() {
			
			if(!resourceAutoIndex) {
				$.ajax({
	    		   url: '/resource/',
	    		   type: 'GET',
	    		   async: false,
	    		   success: function(data) {
	    			   resourceAutoIndex = data.resourceIndex;
	    		   },
	    		   error: function() {
	    			   alert('resourceAutoComplete error');
	    		   }
		    	});
			}
			
			return resourceAutoIndex;
		},
		
		getValue: function() {     
			var value = this.$el.val();
			var intVal = 0;
			_.each(this.getIndex(), function(element, index) {
				if(element.name == value)
					intVal = parseInt(element.key);
	    	});
			
			return intVal;
		},
		    
	    setValue: function(value) {
	      
	    	var nameValue = "";
	    	_.each(this.getIndex(), function(element, index) {
				if(element.key == value)
					nameValue = element.name;
	    	});
	    	
	    	editors.Text.prototype.setValue.call(this, nameValue);
	    }
	});
	
	return Backbone;
	
})(this);