;(function(root) {
	
	var Form = root.Backbone.Form,
    	editors = Form.editors;
	
	Form.setTemplates({
		field: '\
		      <li class="bbf-field field-{{key}}">\
				<% if(title !== false){ %>\
		        <label for="{{id}}">{{title}}</label>\
				<% } %>\
		        <div class="bbf-editor">{{editor}}</div>\
		        <div class="bbf-help">{{help}}</div>\
		        <div class="bbf-error">{{error}}</div>\
		      </li>\
		    ',
	
	    nestedField: '\
	      <li class="bbf-field bbf-nested-field field-{{key}}" title="{{title}}">\
	        <label for="{{id}}">{{title}}</label>\
	        <div class="bbf-editor">{{editor}}</div>\
	        <div class="bbf-help">{{help}}</div>\
	        <div class="bbf-error">{{error}}</div>\
	      </li>\
	    '
	});
	
	editors.StaticBase = Backbone.View.extend({

	    defaultValue: null,
	    hasFocus: false,
	    
	    initialize: function(options) {
	      var options = options || {};

	      if (options.model) {
	        if (!options.key) throw "Missing option: 'key'";

	        this.model = options.model;
	        this.value = this.model.get(options.key);
	      }
	      else if (options.value) {
	        this.value = options.value;
	      }
	      
	      if (this.value === undefined) this.value = this.defaultValue;

	      this.key = options.key;
	      this.form = options.form;
	      this.schema = options.schema || {};
	      this.validators = options.validators || this.schema.validators;
	      
	      //Main attributes
	      this.$el.attr('name', this.getName());
	      
	      //Add custom CSS class names
	      if (this.schema.editorClass) this.$el.addClass(this.schema.editorClass);
	      
	      //Add custom attributes
	      if (this.schema.editorAttrs) this.$el.attr(this.schema.editorAttrs);
	    },

	    getValue: function() {
	      throw 'Not implemented. Extend and override this method.';
	    },
	    
	    setValue: function() {
	      throw 'Not implemented. Extend and override this method.';
	    },
	    
	    focus: function() {
	      //throw 'Not implemented. Extend and override this method.';
	    },
	    
	    blur: function() {
	      //throw 'Not implemented. Extend and override this method.';
	    },

	    /**
	     * Get the value for the form input 'name' attribute
	     *
	     * @return {String}
	     * 
	     * @api private
	     */
	    getName: function() {
	      var key = this.key || '';

	      //Replace periods with underscores (e.g. for when using paths)
	      return key.replace(/\./g, '_');
	    },
	    
	    /**
	     * Update the model with the current value
	     * NOTE: The method is defined on the editors so that they can be used independently of fields
	     *
	     * @return {Mixed} error
	     */
	    commit: function() {
	      /*var error = this.validate();
	      if (error) return error;
	      
	      this.model.set(this.key, this.getValue(), {
	        error: function(model, e) {
	          error = e;
	        }
	      });
	      
	      if (error) return error;*/
	    },
	    
	    /**
	     * Check validity
	     * NOTE: The method is defined on the editors so that they can be used independently of fields
	     * 
	     * @return {String}
	     */
	    validate: function() {
	      /*var $el = this.$el,
	          error = null,
	          value = this.getValue(),
	          formValues = this.form ? this.form.getValue() : {},
	          validators = this.validators,
	          getValidator = Form.helpers.getValidator;

	      if (validators) {
	        //Run through validators until an error is found
	        _.every(validators, function(validator) {
	          error = getValidator(validator)(value, formValues);

	          return error ? false : true;
	        });
	      }

	      return error;*/
	    	return true;
	    },
	    
	    
	    trigger: function(event) {
	      /*if (event === 'focus') {
	        this.hasFocus = true;
	      }
	      else if (event === 'blur') {
	        this.hasFocus = false;
	      }*/
	      
	      return Backbone.View.prototype.trigger.apply(this, arguments);
	    }
	  });

	  //TEXT
	  editors.StaticText = editors.StaticBase.extend({

	    tagName: 'p',
	    defaultValue: '',
	    
	    events: {
	      /*'keyup':    'determineChange',
	      'keypress': function(event) {
	        var self = this;
	        setTimeout(function() {
	          self.determineChange();
	        }, 0);
	      },
	      'select':   function(event) {
	        this.trigger('select', this);
	      },
	      'focus':    function(event) {
	        this.trigger('focus', this);
	      },
	      'blur':     function(event) {
	        this.trigger('blur', this);
	      }*/
	    },
	    
	    initialize: function(options) {
	      editors.Base.prototype.initialize.call(this, options);
	      
	      var schema = this.schema;
	      
	      //Allow customising text type (email, phone etc.) for HTML5 browsers
	      var type = 'text';
	      
	      if (schema && schema.editorAttrs && schema.editorAttrs.type) type = schema.editorAttrs.type;
	      if (schema && schema.dataType) type = schema.dataType;

	      this.$el.attr('type', type);
	    },

	    /**
	     * Adds the editor to the DOM
	     */
	    render: function() {
	      this.setValue(this.value);
	      return this;
	    },
	    
	    determineChange: function(event) {
	      /*var currentValue = this.$el.val();
	      var changed = (currentValue !== this.previousValue);
	      
	      if (changed) {
	        this.previousValue = currentValue;
	        
	        this.trigger('change', this);
	      }*/
	    },

	    /**
	     * Returns the current editor value
	     * @return {String}
	     */
	    getValue: function() {
	      //return this.$el.val();
	    	return this.$el.html();
	    },
	    
	    /**
	     * Sets the value of the form element
	     * @param {String}
	     */
	    setValue: function(value) { 
	      //this.$el.val(value);
	      this.$el.html(value);
	    },
	    
	    focus: function() {
	      /*if (this.hasFocus) return;

	      this.$el.focus();*/
	    },
	    
	    blur: function() {
	      /*if (!this.hasFocus) return;

	      this.$el.blur();*/
	    },
	    
	    select: function() {
	      //this.$el.select();
	    }

	  });
	  
	  //Image
	  editors.StaticImage = editors.StaticBase.extend({

	    tagName: 'img',
	    defaultValue: '',
	    
	    events: {
	    	//...
	    },
	    
	    initialize: function(options) {
	      editors.Base.prototype.initialize.call(this, options);
	      var schema = this.schema;
	    },

	    render: function() {
	    	this.setValue(this.value);
	    	return this;
	    },

	    getValue: function() {
	    	this.value
	    },
	    
	    setValue: function(value) { 
	    	this.$el.attr('src', value);
	    },
	    
	    focus: function() {
	    	//...
	    },
	    
	    blur: function() {
	    	//...
	    },
	    
	    select: function() {
	    	//...
	    }

	  });
	
	return Backbone;
	
})(this);