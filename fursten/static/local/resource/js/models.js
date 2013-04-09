var ResourceWeight = Backbone.Model.extend({
	defaults: {
		resource : 0,
		value : 1
    },
    schema: {
    	resource: {
    		type: 'AutocompleteResource',
    		options: {
    			url:'/resource/search'
    		},
    		editorClass: 'input-medium'
    	},
        value: {
        	type: 'Number',
        	editorClass: 'input-mini'
        }
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
		resource : 0,
		value : 1
    },
    schema: {
    	resource: { type: 'AutocompleteResource', options: {url:'/resource/search'}, editorClass: 'input-medium' },
        value: { type: 'Number', editorClass: 'input-mini' }
    }
});

var ResourceForm = Backbone.Model.extend({
	url: "/resource/new/",
	defaults: {
		key : 0,
    	name : '',
    	threshold : 0.9
    },
    schema: {
    	key: 'Hidden',
        name: 'Text',
        threshold: 'Number',
        weightGroups: {
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

var ResourceListFormItem = Backbone.Model.extend({
	defaults: {
		name : "unknown"
    },
    schema: {
    	key: 'Hidden',
    	icon: { type: 'StaticImage', header: { value: '<i class="icon-picture"></i>'}},
    	name: { type: 'StaticText', header: { value: 'Resource', css: 'main-column' }},
    	isDisplayed: { type: 'Checkbox', header: { value: '<i class="icon-eye-open"></i>'}},
    	isRendered: { type: 'Checkbox', header: { value: '<i class="icon-globe"></i>'}}
    }
});
//Static
var ResourceListForm = Backbone.Model.extend({
	url: "/resource/",
	schema: {
		resources: {
        	type: 'Repeater',
        	itemType: 'NestedModel',
        	layout: 'table',
        	dynamic: false,
        	title: false,
        	model: ResourceListFormItem
        }
    }
});

var ResourceStyleForm = Backbone.Model.extend({
	url: "/resource/id/style",
	defaults: {
    },
    schema: {
    	form: { type: 'Select', options: ['Cube', 'Diamond', 'Circle', 'Triangle'] },
    	color: 'Colorpicker',
        borderColor: 'Colorpicker'
    }
});