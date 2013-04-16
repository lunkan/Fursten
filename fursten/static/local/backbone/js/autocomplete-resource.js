;(function(root) {
	
	var resourceAutoIndex = null;
	var autoIndexLastUpdate = 0;
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	editors.AutocompleteResource = editors.Autocomplete.extend({
	
		getIndex: function() {
			
			//Add a sec cache - this function will be called multiple time in a row
			var currTime = new Date().getTime();
			if(!resourceAutoIndex || (autoIndexLastUpdate + 1000) < currTime) {
				$.ajax({
	    		   url: '/resource/',
	    		   type: 'GET',
	    		   async: false,
	    		   success: function(data) {
	    			   autoIndexLastUpdate = currTime;
	    			   resourceAutoIndex = data.resources;
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