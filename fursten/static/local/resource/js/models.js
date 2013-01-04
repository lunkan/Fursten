var ResourceListItem = Backbone.Model.extend({
    defaults: {
    	label: 'default',
        id: 'undefined'
    }
});
 
//var resourceList_Item = new ResourceListItem({id:1});
//person.fetch(); // fetch model from DB with id = 1
 
//person = new Person({name:"Joe Zim", age:23});
//person.save(); // create and save a new model on the server, also get id back and set it
 
//person = new Person({id:1, name:"Joe Zim", age:23});
//person.save(); // update the model on the server (it has an id set, therefore it is on the server already)
//person.destroy(): // delete the model from the server
 
var ResourceCollection = Backbone.Collection.extend({
    model: ResourceListItem,
    url: "/resource/",
    parse: function (resp, xhr) {
        alert("parse " + JSON.stringify(resp));
        this.change();
    },
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