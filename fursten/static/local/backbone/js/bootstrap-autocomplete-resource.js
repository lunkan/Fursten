Backbone.Form.editors.BootstrapAutocompleteResource = Backbone.Form.editors.BootstrapAutocomplete.extend({
	
	getSelectFunction: function(options) {
		var self = this;
		return function( event, ui ) {
			//Cached the key for later use (getValue)
			self.cachedKey = ui.item.key;
			self.cachedValue = ui.item.value;
	    }
	},
	getSourceProxy: function(options) {
		
		var sourceUrl = options.url;
		return function(request, response) {
			
			var resultItems;
			var requestUrl = sourceUrl + "?qname="+request.term+"&max=5";
			$.ajax({
				dataType: "json",
				url: requestUrl,
				async: false,
				success: function(data) {
					
					var items = [];
					$.each(data, function(index, resourceData) {
						items.push({label:resourceData.name, key:resourceData.key});
					});
					
					response(items);
					return;
				},
				error: function() {
					alert("autocomplete source function faced an error");
				}
			});
		};
	},
	getValue: function() {
		
		var value = Backbone.Form.editors.Text.prototype.getValue.call(this);
		//alert("getValue " + this.cachedKey + " # " + this.cachedValue + " : " + value);
		
		//Validate that value is set by autocomplete and and return resource key insted of nake 
		if(value == this.cachedValue)
			return parseInt(this.cachedKey);
		else
			return ""
			
		//alert("Resource cachedKey is not set - must be set while select or set value");
	},
    setValue: function(value) {
    	
    	var self = this;
    	
    	if(!value) {
    		return;
    	}
    	else if(isNaN(value)) {
    		Backbone.Form.editors.Text.prototype.setValue.call(this, "["+value+"]");
    		return;
    	}
    	
    	var requestUrl = this.schema.options.url + "/"+value+"/";
		$.ajax({
			dataType: "json",
			url: requestUrl,
			success: function(data) {
				
				try{
					//Cached the key for later use (getValue)
					self.cachedKey = data.key;
					self.cachedValue =  data.name;
					Backbone.Form.editors.Text.prototype.setValue.call(self, data.name);
				}
				catch(e) {
					alert("could not set resource name by key");
				}
			},
			error: function() {
				alert("could not find a matching resource for key: " + value);
			}
		});
    }
});