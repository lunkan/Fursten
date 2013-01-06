var WorldForm = Backbone.Model.extend({
	url: "/world/new/",
	defaults: {
    	name : 'default name',
    	width : 5000,
    	height : 5000
    },
    schema: {
        name: 'Text',
        width: 'Number',
        height: 'Number'
    }
});