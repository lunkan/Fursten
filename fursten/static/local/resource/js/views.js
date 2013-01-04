 

var Views = {}
jQuery(document).ready(function($) {
	
	Views.ResourceListView = Backbone.View.extend({
    
		template: _.template($('#table').html()),
	
	    initialize: function () {
	    	alert("a" + this.collection.length);
	    	_.bindAll(this, 'render');
	    	this.collection.bind('change', this.render);
	    	
	    	//this.model.bind('change', this.render, this);
	    	//this.render();
	    },
	    render : function() {
	    	
	    	alert("b" + this.collection.length);
	    	
	    	var that = this;
	        $(this.el).empty();
	        $(this.el).html(this.template({id:'id'}));
	        
	        /*_(this.collection.models).each(function(item){ // in case collection is not empty
	            self.appendItem(item);
	        }, this);*/
	        
	        // Render each sub-view and append it to the parent view's element.
	       /* _(this._donutViews).each(function(dv) {
	          $(that.el).append(dv.render().el);
	        });*/
	    }
	});
});

//var test = new ResourceListView({});