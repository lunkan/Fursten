;
(function() {
  
	var Form = Backbone.Form, editors = Form.editors;

	Form.setTemplates({
		repeaterList: '\
			  <div class="bbf-list">\
			  	<ul>{{items}}</ul>\
			  	<div class="bbf-actions"><button type="button" data-action="add" data-cid="{{cid}}">Add</div>\
			  </div>\
		',
		repeaterTable: '\
			  <div class="bbf-list" data-spec="alpha">\
			  	<table class="table table-striped table-condensed">\
					<colgroup>\
					<% _.each(headers, function(header) { %>\
		    			<col/>\
					<% }); %>\
		  			</colgroup>\
					<thead>\
						<tr>\
						<% _.each(headers, function(header) { %>\
							<th>{{header}}</th>\
						<% }); %>\
						<% if(dynamic !== false){ %>\
						<th></th>\
						<% } %>\
						</tr>\
					</thead>\
					<% if(dynamic !== false){ %>\
					<tfoot>\
						<tr>\
							<td colspan="{{headers.length+1}}"><div class="bbf-actions"><button type="button" data-action="add" data-cid="{{cid}}">Add</div></td>\
						</tr>\
					</tfoot>\
					<% } %>\
					<tbody>{{items}}</tbody\
				</table>\
			  </div>\
		',
		  repeaterRow: '\
			  <td>{{editor}}</td>\
		',
		nestedForm: '<div class="bbf-nested-form">{{fieldsets}}</div>',
	    nestedFormFieldset :'<p class="nestedFormFieldset">{{fields}}</p>',
	    nestedFormFieldTemplate: '\
	      <td class="bbf-field field-{{key}}">\
	        <div class="bbf-editor">{{editor}}</div>\
	        <div class="bbf-help">{{help}}</div>\
	        <div class="bbf-error">{{error}}</div>\
	      </td>\
	    '
	  });
	
	editors.Repeater = editors.Base.extend({

		events : {
			'click [data-action="add"]' : function(event) {
				event.preventDefault();
				if (this.cid === $(event.target).attr('data-cid'))
					this.addItem(null, true);
			}
		},

		initialize : function(options) {

			editors.Base.prototype.initialize.call(this, options);

			var schema = this.schema;
			if (!schema)
				throw "Missing required option 'schema'";

			// Determine the editor to use
			this.Editor = (function() {
				var type = schema.itemType;

				// Default to Text
				if (!type)
					return editors.Text;
				
				// Use List-specific version if available
				if (editors.Repeater[type])
					return editors.Repeater[type];

				// Or whichever was passed
				return editors[type];
			})();
			
			// List schema defaults
			if (this.schema.layout == 'table') {
				this.schema = _.extend({
					listTemplate : 'repeaterTable',
					listItemTemplate : 'repeaterRow'
				}, schema);
			} else {
				this.schema = _.extend({
					listTemplate : 'repeaterList',
					listItemTemplate : 'listItem'
				}, schema);
			}

			var editor = new this.Editor({
				key : this.key,
				schema : this.schema,
				value : this.value,
				list : this,
				item : this
			});
			
			this.headers = (function() {
				
				var headers = [];
				for(var key in editor.nestedSchema){
					if(editor.nestedSchema[key] != "Hidden") {
						if(editor.nestedSchema[key].header != undefined)
							headers.push(editor.nestedSchema[key].header);
						else
							headers.push(key);
					}
				}
				
				return headers;
				
			})();
			
			if(this.schema.dynamic === false)
				this.dynamic = false;
			else
				this.dynamic = true;
			
			this.items = [];
		},

		render : function() {
			var self = this, value = this.value || [];

			// Create main element
			var emptyEl;
			if (this.schema.layout == 'table')
				emptyEl = '<tr class="bbf-tmp"></tr>';
			else
				emptyEl = '<b class="bbf-tmp"></b>';

			var $el = $(Form.templates[this.schema.listTemplate]({
				items : emptyEl,
				headers : this.headers,
				dynamic : this.dynamic,
				cid : this.cid
			}));

			// Store a reference to the list (item container)
			this.$list = $el.find('.bbf-tmp').parent().empty();

			// Add existing items
			// items is array or single item as object
			if(Object.prototype.toString.call(value) !== '[object Array]' && value) {
			    self.addItem(value);
			}
			else if (value.length) {
				_.each(value, function(itemValue) {
					self.addItem(itemValue);
				});
			}

			// If no existing items create an empty one, unless the editor
			// specifies otherwise
			else {
				if (!this.Editor.isAsync)
					this.addItem();
			}

			this.setElement($el);
			this.$el.attr('id', this.id);
			this.$el.attr('name', this.key);

			if (this.hasFocus)
				this.trigger('blur', this);

			return this;
		},

		addItem : function(value, userInitiated) {
			var self = this;
			
			// Create the item
			var item = new editors.Repeater.Item({
				list : this,
				schema : this.schema,
				value : value,
				Editor : this.Editor,
				key : this.key
			}).render();

			var _addItem = function() {
				self.items.push(item);
				self.$list.append(item.el);

				item.editor.on('all', function(event) {
					if (event === 'change')
						return;

					var args = _.toArray(arguments);
					args[0] = 'item:' + event;
					args.splice(1, 0, self);

					editors.Repeater.prototype.trigger.apply(this, args);
				}, self);

				item.editor.on('change', function() {
					if (!item.addEventTriggered) {
						item.addEventTriggered = true;
						this.trigger('add', this, item.editor);
					}
					this.trigger('item:change', this, item.editor);
					this.trigger('change', this);
				}, self);

				item.editor.on('focus', function() {
					if (this.hasFocus)
						return;
					this.trigger('focus', this);
				}, self);
				item.editor.on('blur', function() {
					if (!this.hasFocus)
						return;
					var self = this;
					setTimeout(function() {
						if (_.find(self.items, function(item) {
							return item.editor.hasFocus;
						}))
							return;
						self.trigger('blur', self);
					}, 0);
				}, self);

				if (userInitiated || value) {
					item.addEventTriggered = true;
				}

				if (userInitiated) {
					self.trigger('add', self, item.editor);
					self.trigger('change', self);
				}
			};

			// Check if we need to wait for the item to complete before adding
			// to the list
			if (this.Editor.isAsync) {
				item.editor.on('readyToAdd', _addItem, this);
			}

			// Most editors can be added automatically
			else {
				_addItem();
			}

			return item;
		},

		removeItem : function(item) {
			// Confirm delete
			var confirmMsg = this.schema.confirmDelete;
			if (confirmMsg && !confirm(confirmMsg))
				return;

			var index = _.indexOf(this.items, item);

			this.items[index].remove();
			this.items.splice(index, 1);

			if (item.addEventTriggered) {
				this.trigger('remove', this, item.editor);
				this.trigger('change', this);
			}

			if (!this.items.length && !this.Editor.isAsync)
				this.addItem();
		},

		getValue : function() {
			var values = _.map(this.items, function(item) {
				return item.getValue();
			});

			// Filter empty items
			return _.without(values, undefined, '');
		},

		setValue : function(value) {
			this.value = value;
			this.render();
		},

		focus : function() {
			if (this.hasFocus)
				return;

			if (this.items[0])
				this.items[0].editor.focus();
		},

		blur : function() {
			if (!this.hasFocus)
				return;

			var focusedItem = _.find(this.items, function(item) {
				return item.editor.hasFocus;
			});

			if (focusedItem)
				focusedItem.editor.blur();
		},

		/**
		 * Override default remove function in order to remove item views
		 */
		remove : function() {
			_.invoke(this.items, 'remove');

			editors.Base.prototype.remove.call(this);
		},

		/**
		 * Run validation
		 * 
		 * @return {Object|Null}
		 */
		validate : function() {
			if (!this.validators)
				return null;

			// Collect errors
			var errors = _.map(this.items, function(item) {
				return item.validate();
			});

			// Check if any item has errors
			var hasErrors = _.compact(errors).length ? true : false;
			if (!hasErrors)
				return null;

			// If so create a shared error
			var fieldError = {
				type : 'list',
				message : 'Some of the items in the list failed validation',
				errors : errors
			};

			return fieldError;
		}
	});

	editors.Repeater.Item = Backbone.View
			.extend({
				events : {
					'click [data-action="remove"]' : function(event) {
						event.preventDefault();
						this.list.removeItem(this);
					},
					'keydown input[type=text]' : function(event) {
						if (event.keyCode !== 13)
							return;
						event.preventDefault();
						this.list.addItem();
						this.list.$list.find("> li:last input").focus();
					}
				},

				initialize : function(options) {
					this.list = options.list;
					this.schema = options.schema || this.list.schema;
					this.value = options.value;
					this.Editor = options.Editor || editors.Text;
					this.key = options.key;
				},

				render : function() {

					// Create editor
					this.editor = new this.Editor({
						key : this.key,
						schema : this.schema,
						value : this.value,
						list : this.list,
						item : this
					}).render();

					// Create main element
					var $el = $(Form.templates[this.schema.listItemTemplate]({
						editor : '<b class="bbf-tmp"></b>'
					}));

					if (this.schema.listItemTemplate == "repeaterRow") {
						
						var $altElm = $('<tr></tr>');
						
						//Adds id attribute to row if id or key is supplied
						//Todo:get cid if possible
						if(this.value) {
							if(this.value.key)
								$altElm.attr("id", this.value.key);
							if(this.value.id)
								$altElm.attr("id", this.value.id);
						}
						
						$.each($(this.editor.el).find('td'), function() {
							$altElm.append($(this));
						});

						$altElm.attr('name', this.editor.getName());
						this.setElement($altElm);
					} else {

						$el.find('.bbf-tmp').parent().replaceWith(
								this.editor.el);
						// Replace the entire element so there isn't a wrapper
						// tag
						this.setElement($el);
					}

					return this;
				},

				getValue : function() {
					return this.editor.getValue();
				},

				setValue : function(value) {
					this.editor.setValue(value);
				},

				focus : function() {
					this.editor.focus();
				},

				blur : function() {
					this.editor.blur();
				},

				remove : function() {
					this.editor.remove();

					Backbone.View.prototype.remove.call(this);
				},

				validate : function() {
					var value = this.getValue(), formValues = this.list.form ? this.list.form
							.getValue()
							: {}, validators = this.schema.validators, getValidator = Form.helpers.getValidator;

					if (!validators)
						return null;

					// Run through validators until an error is found
					var error = null;
					_.every(validators, function(validator) {
						error = getValidator(validator)(value, formValues);

						return error ? false : true;
					});

					// Show/hide error
					if (error) {
						this.setError(error);
					} else {
						this.clearError();
					}

					// Return error to be aggregated by list
					return error ? error : null;
				},

				//Show a validation error
				setError : function(err) {
					this.$el.addClass(Form.classNames.error);
					this.$el.attr('title', err.message);
				},

				//Hide validation errors
				clearError : function() {
					this.$el.removeClass(Form.classNames.error);
					this.$el.attr('title', null);
				}
			});

	/**
	 * Modal object editor for use with the List editor. To use it, set the
	 * 'itemType' property in a List schema to 'Object' or 'NestedModel'
	 */
	editors.Repeater.Modal = editors.Repeater.Object = editors.Repeater.NestedModel = editors.Base.extend({
				
		events: {},

		initialize: function(options) {
			
			  editors.Base.prototype.initialize.call(this, options);

		      // Reverse the effect of the "feature" of pressing enter adding new item
		      // https://github.com/powmedia/backbone-forms/commit/6201a6f44984087b71c216dd637b280dab9b757d
		      delete this.options.item.events['keydown input[type=text]'];

		      var schema = this.schema;
		      if (!schema.model) { // throw 'Missing required option "schema.model"';
		    	this.schema.model = {};
		      }
		      
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

		        var nestedModel = this.schema.model;
		        var modelInstance = new nestedModel(this.getValue());
		        var template = 'nestedForm';
		        
		        this.form = new Form({
		          template: template,
		          fieldsetTemplate: 'nestedFormFieldset',
		          fieldTemplate: 'nestedFormFieldTemplate',
		          model: modelInstance
		        });
		        
		        var formEl = this.form.render().el;
		        
		        if(this.schema.layout == "table" && this.schema.dynamic !== false) {
		      	  $(formEl).append('<td><button type="button" data-action="remove" class="bbf-remove">&times;</button></td>');
		        }
		        
		        return formEl;
		      },

				//Returns the string representation of the object value
				getStringValue : function() {
					var schema = this.schema, value = this.getValue();

					if (_.isEmpty(value))
						return '[Empty]';

					// If there's a specified toString use that
					if (schema.itemToString)
						return schema.itemToString(value);

					// Otherwise check if it's NestedModel with it's own
					// toString() method
					if (schema.itemType === 'NestedModel') {
						return new (schema.model)(value).toString();
					}

					// Otherwise use the generic method or custom overridden
					// method
					return this.itemToString(value);
				},

			    onUserAdd: function() {
			    	//this.form.$('input, textarea, select').first().focus();
			    },

			    getValue: function() {
			        if (this.form) {
			      	
			          this.value = this.form.getValue();
			          //console.log('nested form value', this.value);
			          // see https://github.com/powmedia/backbone-forms/issues/81
			        }
			        return this.value;
			      },

				setValue : function(value) {
					this.value = value;
				},

				focus : function() {
					if (this.hasFocus)
						return;

					this.openEditor();
				},

				blur : function() {
					if (!this.hasFocus)
						return;

					if (this.modal) {
						this.modal.trigger('cancel');
						this.modal.close();
					}
				}
			}, {
				// STATICS
				// Make the wait list for the 'ready' event before adding the
				// item to the list
				isAsync : true
			});

})();