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

var WorldStatusItem = Backbone.Model.extend({
	defaults: {
		name :"unknown",
		tick : 0,
		width : 0,
		height: 0
    },
    schema: {
    	name: { type: 'StaticText' },
    	tick: { type: 'StaticText' },
    	width: { type: 'StaticText' },
    	height: { type: 'StaticText' }
    }
});
//Static
var WorldStatus = Backbone.Model.extend({
	url: "/world/status",
	schema: {
		worldStatus: {
        	type: 'Repeater',
        	itemType: 'NestedModel',
        	layout: 'table',
        	dynamic: false,
        	title: false,
        	model: WorldStatusItem
        }
    }
});