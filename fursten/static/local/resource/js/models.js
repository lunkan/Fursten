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
		value : 32,
		group : 1
    },
    schema: {
    	resource: 'Number',
        value: 'Number',
        group: { type: 'Select', options: ['1', '2', '3'] }
    }
});

function testToString(object) {
    return "Hej";
}

var ResourceOffspring = Backbone.Model.extend({
	defaults: {
		resource : 123,
		value : 321
    },
    schema: {
    	resource: 'Number',
        value: 'Number'
    }
});

var ResourceForm = Backbone.Model.extend({
	url: "/resource/new/",
	defaults: {
    	name : 'default name',
    	threshold : 123,
    	offsprings : [],
    	weights: []
    },
    schema: {
    	atomat: { type: 'Autocomplete', options: {
    		schema: {queryUrl: '/resource/names/', itemToString: testToString }
    	}},
        name: 'Text',
        threshold: 'Number',
        weights: {
        	type: 'List',
        	itemType: 'InlineNestedModel',
        	model: ResourceWeight
        },
        offsprings: {
        	type: 'List',
        	itemType: 'InlineNestedModel',
        	model: ResourceOffspring
        }
    }
});

/*
 * 
        offsprings: { type: 'NestedModel', model: ResourceOffspring }

//weight: { type: 'NestedModel', model: ResourceWeight },
	private int key;
	private String name;
	private float threshold;
	
	private ArrayList<OffspringNode> offsprings;
	private ArrayList<HashMap<Integer, Float>> weights;
*/