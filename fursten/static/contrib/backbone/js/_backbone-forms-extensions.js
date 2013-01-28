/* vim: set tabstop=2 shiftwidth=2 softtabstop=2: */
;(function(root) {

  var Form = root.Backbone.Form,
      editors = Form.editors;
      
  Form.setTemplates({
	  repeater: '\
		  <div class="bbf-list">\
		  	<ul>{{items}}</ul>\
		  	<div class="bbf-actions"><button type="button" data-action="add" data-cid="{{cid}}">Add</div>\
		  </div>\
	',
	repeaterTable: '\
		  <div class="bbf-list" data-spec="alpha">\
		  	<table class="table">\
				<thead>\
					<tr>\
					<% _.each(headers, function(header) { %>\
						<th>{{header}}</th>\
					<% }); %>\
					<th>rem header</th>\
					</tr>\
				</thead>\
				<tbody>{{items}}</tbody\
			</table>\
			<div class="bbf-actions"><button type="button" data-action="add" data-cid="{{cid}}">Add</div>\
		  </div>\
	',
	  repeaterRow: '\
		  <td>{{editor}}</td>\
	'
  });
  
  /*editors.Repeater = editors.List.extend({
	  
	  events: {
		  'click [data-action="add"]': function(event) {
			  event.preventDefault();
			  if(this.cid === $(event.target).attr('data-cid'))
				  this.addItem(null, true);
		  	}
	  },
	  
	  initialize: function(options) {
		  
		  
		  editors.Base.prototype.initialize.call(this, options);
		  
	      var schema = this.schema;
	      if (!schema) throw "Missing required option 'schema'";

	      
	      
	      //List schema defaults
	      if(this.schema.layout == 'table') {
	    	  alert(JSON.stringify(options.model));
	    	  this.schema = _.extend({
	    		  listTemplate: 'repeaterTable',
			      listItemTemplate: 'repeaterRow'
			  }, schema);
	      }
	      else {
		      this.schema = _.extend({
		        listTemplate: 'repeater',
		        listItemTemplate: 'listItem'
		      }, schema);
	      }
	      
	      //Determine the editor to use
	      this.Editor = (function() {
	        var type = schema.itemType;

	        //Default to Text
	        if (!type) return editors.Text;

	        //Use List-specific version if available
	        if (editors.List[type]) return editors.List[type];

	        //Or whichever was passed
	        return editors[type];
	      })();
	      
	      this.items = [];
	    },

	    render: function() {
	      var self = this,
	          value = this.value || [];
	      
	      //Create main element
	      var emptyEl;
	      if(this.schema.layout == 'table')
	    	  emptyEl = '<tr class="bbf-tmp"></tr>';
	      else
	    	  emptyEl = '<b class="bbf-tmp"></b>';
	      
	      var $el = $(Form.templates[this.schema.listTemplate]({
	        items: emptyEl,
	        headers: ['header1', 'header2','header3'],
	        cid: this.cid
	      }));
	      
	      //Store a reference to the list (item container)
	      this.$list = $el.find('.bbf-tmp').parent().empty();

	      //Add existing items
	      if (value.length) {
	        _.each(value, function(itemValue) {
	        	//self.$list.append(item.el);
	        	
	        	
	          self.addItem(itemValue);
	        });
	      }

	      //If no existing items create an empty one, unless the editor specifies otherwise
	      else {
	        if (!this.Editor.isAsync) this.addItem();
	      }
	      
	      this.setElement($el);
	      this.$el.attr('id', this.id);
	      this.$el.attr('name', this.key);
	            
	      if (this.hasFocus) this.trigger('blur', this);
	      
	      return this;
	    },
  });*/
  
  return Backbone;
})(this);

;(function(root) {

  var Form = root.Backbone.Form,
      editors = Form.editors;
      
  // we don't want our nested form to have a (nested) <form> tag
  // (currently bbf includes form tags: https://github.com/powmedia/backbone-forms/issues/8)
  // aside from being strange html to have nested form tags, it causes submission-upon-enter
  Form.setTemplates({
    nestedForm: '<div class="bbf-nested-form">{{fieldsets}}</div>',
    nestedFormRow: '<p class="me">{{fieldsets}}</p>',
    nestedFormFieldset :'<p class="nestedFormFieldset">{{fields}}</p>',
    nestedFormFieldTemplate: '\
      <td class="bbf-field field-{{key}}">\
        <div class="bbf-editor">{{editor}}</div>\
        <div class="bbf-help">{{help}}</div>\
        <div class="bbf-error">{{error}}</div>\
      </td>\
    ',
    test: '<p>test</p>'
  });

  /*editors.List.InlineNestedModel = editors.List.NestedModel.extend({
  
    events: {},

    initialize: function(options) {
      editors.Base.prototype.initialize.call(this, options);

      // Reverse the effect of the "feature" of pressing enter adding new item
      // https://github.com/powmedia/backbone-forms/commit/6201a6f44984087b71c216dd637b280dab9b757d
      delete this.options.item.events['keydown input[type=text]'];

      var schema = this.schema;
      if (!schema.model) throw 'Missing required option "schema.model"';

      this.nestedSchema = schema.model.prototype.schema;
      if (_.isFunction(this.nestedSchema)) this.nestedSchema = this.nestedSchema();

      var list = options.list;
      list.on('add', this.onUserAdd, this);
    },
    
    //Render the list item representation
    render: function() {
      var self = this;

      this.$el.html(this.getFormEl());
      
      setTimeout(function() {
        self.trigger('readyToAdd');
      }, 0);

      return this;
    },

    getFormEl: function() {
      var schema = this.schema,
          value = this.getValue();
      
      // when adding a new item, need to instantiate a new empty model
      // TODO is this the best place for this?
      //if (!value) { value = new schema.model(); }

      //var modelInstance = (data.constructor === nestedModel) ? data : new nestedModel(data);
      //Jonas - this seems to be the correct way to implement it
      var nestedModel = this.schema.model;
      var modelInstance = new nestedModel(this.getValue());
      var template = 'nestedForm';
      
      if(this.schema.layout == 'table') {
    	  template = 'nestedFormRow';
      }
      
      this.form = new Form({
        template: template,
        fieldsetTemplate: 'nestedFormFieldset',
        fieldTemplate: 'nestedFormFieldTemplate',
        model: modelInstance
      });
      
      var formEl = this.form.render().el;
      
      if(this.schema.layout) {
    	  $(formEl).append('<td><button type="button" data-action="remove" class="bbf-remove">&times;</button></td>');
      }
      
      return formEl;
      //return this.form.render().el;
    },

    getValue: function() {
      if (this.form) {
    	
        this.value = this.form.getValue();
        //console.log('nested form value', this.value);
        // see https://github.com/powmedia/backbone-forms/issues/81
      }
      return this.value;
    },

    onUserAdd: function() {
    	this.form.$('input, textarea, select').first().focus();
    }

  });*/
  
  return Backbone;
})(this);


/*;(function(root) {
	
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	editors.Autocomplete = editors.Text.extend({
	
		render: function() {
		    
			this.setValue(this.value);
			this.$el.autocomplete({
				source: this.schema.options.url,
				minLength: 2,
			    select: function( event, ui ) {
			    }
			});
	
		    return this;
		  }
	
		});
	
	return Backbone;
	
})(this);*/
