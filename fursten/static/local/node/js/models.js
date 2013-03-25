var Node = Backbone.Model.extend({
	defaults: {
		r : 0,
		x : 0,
		y : 0
    },
    schema: {
    	r: {
    		type: 'AutocompleteResource',
    		options: {
    			url:'/resource/search'
    		},
    		editorClass: 'input-medium'
    	},
        x: {
        	type: 'Number',
        	editorClass: 'input-mini'
        },
        y: {
        	type: 'Number',
        	editorClass: 'input-mini'
        }
    }
});

var NodeForm = Backbone.Model.extend({
	url: "/node/",
	defaults: {
		nodes : []
    },
    schema: {
    	nodes: {
        	type: 'Repeater',
        	layout: 'table',
        	itemType: 'NestedModel',
        	model: Node
        }
    }
});

/**
 * Samples
 */
var Sample = Backbone.Model.extend({
	defaults: {
		r : 0,
		x : 0,
		y : 0,
		stability: 0
    },
    schema: {
    	r: {
    		type: 'AutocompleteResource',
    		options: {
    			url:'/resource/search'
    		},
    		editorClass: 'input-medium'
    	},
        x: {
        	type: 'Number',
        	editorClass: 'input-mini'
        },
        y: {
        	type: 'Number',
        	editorClass: 'input-mini'
        },
        stability: {
        	type: 'Number',
        	editorClass: 'input-mini'
        }
    }
});

var SampleForm = Backbone.Model.extend({
	url: "/node/samples",
	schema: {
    	samples: {
        	type: 'Repeater',
        	layout: 'table',
        	itemType: 'NestedModel',
        	model: Sample
        }
    }
});