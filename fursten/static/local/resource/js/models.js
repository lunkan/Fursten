var ResourceListItem = Backbone.Model.extend({
    defaults: {
    	name : 'default name'
    }
});
 
var ResourceCollection = Backbone.Collection.extend({
    model: ResourceListItem,
    url: "/resource/"
});

var ResourceWeight = Backbone.Model.extend({
	defaults: {
		resource : 1,
		value : 32
    },
    schema: {
    	resource: { type: 'Autocomplete', options: {url:'/resource/search'}, editorClass: 'input-medium' },
        value: { type: 'Number', editorClass: 'input-mini' }
    }
});

var ResourceWeightGroup = Backbone.Model.extend({
	defaults: {
		weights : []
    },
    schema: {
    	weights: {
        	type: 'Repeater',
        	layout: 'table',
        	itemType: 'NestedModel',
        	model: ResourceWeight
        },
    }
});

var ResourceOffspring = Backbone.Model.extend({
	defaults: {
		resource : 123,
		value : 321
    },
    schema: {
    	resource: { type: 'Autocomplete', options: {url:'/resource/search'}, editorClass: 'input-medium' },
        value: { type: 'Number', editorClass: 'input-mini' }
    }
});

var ResourceForm = Backbone.Model.extend({
	url: "/resource/new/",
	defaults: {
    	name : 'default name',
    	threshold : 123,
    	offsprings : [],
    	weightgroups: []
    },
    schema: {
    	atomat: { type: 'Autocomplete', options: {url:'/resource/search'}},
        name: 'Text',
        threshold: 'Number',
        weightgroups: {
        	type: 'Repeater',
        	itemType: 'NestedModel',
        	model: ResourceWeightGroup
        },
        offsprings: {
        	type: 'Repeater',
        	itemType: 'NestedModel',
        	layout: 'table',
        	model: ResourceOffspring
        }
    }
});