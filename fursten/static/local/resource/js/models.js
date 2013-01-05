var ResourceListItem = Backbone.Model.extend({
    defaults: {
    	value : 'default',
    	label : 'default',
        id: 'undefined'
    }
});
 
var ResourceCollection = Backbone.Collection.extend({
    model: ResourceListItem,
    url: "/resource/"
    /*parse: function (resp, xhr) {
        alert("parse " + JSON.stringify(resp));
        this.trigger("change");
    },*/
});

var User = Backbone.Model.extend({
    schema: {
        title:      { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
        name:       'Text',
        email:      { validators: ['required', 'email'] },
        birthday:   'Date',
        password:   'Password',
        notes:      { type: 'List', listType: 'Text' }
    }
});

var ResourceForm = Backbone.Model.extend({
	url: "/resource/new/",
    schema: {
        title:      { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
        name:       'Text',
        email:      { validators: ['required', 'email'] },
        birthday:   'Date',
        password:   'Password',
        notes:      { type: 'List', listType: 'Text' }
    }
});