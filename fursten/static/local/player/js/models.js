var Player = Backbone.Model.extend({
	defaults: {
		name : ''
    },
    schema: {
    	name: 'Text'
    }
});

var NewPlayerForm = Backbone.Model.extend({
	url: "/player/new",
	defaults: {
		name : 'Lennart'
    },
    schema: {
    	name : 'Text'
    }
});
