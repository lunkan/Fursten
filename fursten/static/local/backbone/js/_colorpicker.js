;(function(root) {
	
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	editors.Colorpicker = editors.Base.extend({

	    tagName: 'div',
	    defaultValue: '',
	    previousValue: '',
	    
	    events: {
	      //...
	    },
	    
	    initialize: function(options) {
	      editors.Base.prototype.initialize.call(this, options);
	      this.$el.attr('data-color-format', 'hex');
	      this.$el.addClass('input-append color');
	    	  
	    },
	    
	    focus: function() {
	      //...
	    },
	    
	    blur: function() {
	      //...
	    },
	    
	    select: function() {
	      //...
	    },
	
		render: function() {
		    
			this.$el.attr('data-color', this.value);
		    this.$el.append('<input type="text" class="span3" value="'+this.value+'" ><span class="add-on"><i style="background-color: rgb(255, 146, 180)"></i></span>');
			this.$el.colorpicker();
			
			return this;
		},
	
		getValue: function() {     
			var value = this.$el.find('input').val();
			return value;
		}
	});
	
	return Backbone;
	
})(this);