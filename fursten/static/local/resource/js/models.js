var ResourceListItem = Backbone.Model.extend({
    defaults: {
    	name : 'default name'
    }
});
 
var ResourceCollection = Backbone.Collection.extend({
    model: ResourceListItem,
    url: "/resource/"
});

var ResourceForm = Backbone.Model.extend({
	url: "/resource/new/",
	defaults: {
    	name : 'default name'
    },
    schema: {
        name:       'Text'
    }
});