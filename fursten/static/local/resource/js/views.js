var recourceViews = {}

jQuery(document).ready(function($) {
	recourceViews.ResourceListView = Backbone.View.extend({
    
		template: _.template($('#tpl-table').html()),
		itemTemplate: _.template($('#tpl-table-row').html()),
	
	    initialize: function () {
	    	this.collection.on('sync', this.render, this);
	    },
	    render : function() {
	    	
	    	var that = this;
	        $(this.el).empty();
	        var renderedTable = $(this.template({id:'id'}));
	        var tableHeadEl = $(renderedTable).find('thead');
	        var tableBodyEl = $(renderedTable).find('tbody');
	        
	        _(this.collection.models).each(function(item){
	        	var renderedItem = this.itemTemplate(item.toJSON());
	        	$(tableBodyEl).append(renderedItem);
	        }, this);
	        
	        $(this.el).html(renderedTable);
	    }
	});
});