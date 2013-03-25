var ConnectForm = Backbone.Model.extend({
	url: "/diagram/connecttosimulator/",
	defaults: {
		simulatorUrl : 'localhost:8888',
    },
    schema: {
        simulatorUrl : 'Text',
    }
});