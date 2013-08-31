
var ResourceListModule = (function () {
	
	var resourceListModule = function() {
		
		var self = this;
		var selectedResource = null;
		
		//MESSAGES
		fu.msg.resourceSelected = new signals.Signal();
		fu.msg.resourceFilterChanged = new signals.Signal();
		
		//MODELS
		var ResourseListItem = Backbone.Model.extend({
			idAttribute: 'key',
			url: function() {
				var original_url = Backbone.Model.prototype.url.call( this );
			    var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) != '/' ? '/' : '' );
			    return parsed_url;
			}
		});
		var ResourseList = Backbone.Collection.extend({
			model: ResourseListItem,
			url:'/resourcelist/',
			comparator: function( collection ){
				return( collection.get( 'key' ));
			}
		});
		
		var ResourseListModel = new ResourseList;
		
		//VIEWS
		var ResourseItemView = Backbone.View.extend({
			tagName:  'tr',
			attributes: {'class':'resource-item'},
			
			template: _.template('\
				<td class="resource-item__label"><span class="indent-<%= indent %>"></span><img src="<%= icon %>"/>&nbsp;&nbsp;<%= name %></td>\
				<td><input type="checkbox" name="isDisplayed" <% if(isDisplayed) { %> checked <% } %> value="isDisplayed"></td>\
				<td><input type="checkbox" name="isRendered" <% if(isRendered) { %> checked <% } %> value="isRendered"></td>\
				<td><input type="checkbox" name="isRiver" <% if(isRiver) { %> checked <% } %> value="isRiver"></td>\
			'),
			events: {
				'click .resource-item__label'   : 'select',
				'change [name="isDisplayed"]' : 'toggleDisplay',
				'change [name="isRendered"]' : 'toggleRender',
				'change [name="isRiver"]' : 'toggleRiver'
			},
			initialize: function() {
				this.listenTo(this.model, 'change', this.autoSave);
				this.listenTo(this.model, 'sync', this.render)
				this.listenTo(this.model, 'destroy', this.remove);
			},
			render: function() {
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			},
			select: function() {
				fu.msg.resourceSelected.dispatch(this.model.toJSON().key);
			},
			toggleDisplay: function() {
				var $checkbox = this.$el.find('[name="isDisplayed"]').first();
				var isChecked = $checkbox.prop('checked');
				this.model.set("isDisplayed", isChecked);
			},
			toggleRender: function() {
				var $checkbox = this.$el.find('[name="isRendered"]').first();
				var isChecked = $checkbox.prop('checked');
				this.model.set("isRendered", isChecked);
			},
			toggleRiver: function() {
				var $checkbox = this.$el.find('[name="isRiver"]').first();
				var isChecked = $checkbox.prop('checked');
				this.model.set("isRiver", isChecked);
			},
			autoSave: function() {
				var resourceKey = this.model.get("key");
				this.model.save({}, {
					success: function() {
						fu.msg.resourceFilterChanged.dispatch(resourceKey);
					},
					error: function() {
						alert("Failed update resource filter");
					}
				});
			},
			clear: function() {
				this.model.destroy();
			}
		});
		
		var ResourseListView = Backbone.View.extend({
			resourseListTemp: _.template('\
				<table class="table table-striped table-condensed">\
					<colgroup>\
						<col span="1" style="width:100%">\
						<col span="1" style="width:1px">\
						<col span="1" style="width:1px">\
						<col span="1" style="width:1px">\
					</colgroup>\
					<thead>\
						</tr>\
							<th>Name</th>\
							<th><span class="glyphicon glyphicon-eye-open"></span></th>\
							<th><span class="glyphicon glyphicon-globe"></span></th>\
							<th><span class="glyphicon glyphicon-random"></span></th>\
						</tr>\
			        </thead>\
					<tbody class="resource-list-items">\
			        </tbody>\
				</table>\
			'),
			initialize: function() {
				this.render();
				this.listenTo(ResourseListModel, 'add', this.addItem);
				this.listenTo(ResourseListModel, 'remove', this.removeItem);
				this.listenTo(ResourseListModel, 'reset', this.render);
			    ResourseListModel.fetch();
			},
			addItem: function(item) {
				var view = new ResourseItemView({model: item});
				var $viewEl = $(view.render().el);
				$viewEl.attr("id", item.toJSON().key);
				
				//Insert the item in correct order
				var insertIndex = ResourseListModel.indexOf(item);
				var insertAfterElm = this.$el.find('.resource-item')[insertIndex];
				if(insertAfterElm)
					$(insertAfterElm).before($viewEl);
				else
					$(this.$el.find(".resource-list-items")).append($viewEl);
			},
			removeItem: function(item) {
				var resourceKey = item.toJSON().key;
				var $view = this.$el.find('#'+resourceKey).first();
				
				//Trigger filter change if deleted resource had filters applied
				if(item.get("isDisplayed") || item.get("isRendered") || item.get("isRiver"))
					fu.msg.resourceFilterChanged.dispatch(resourceKey);
				
				//Reset selected resource if resource was selected
				if($view.hasClass("selected"))
					fu.msg.resourceSelected.dispatch(null);
				
				$view.remove();
			},
			render: function() {
				$(this.el).html("");
				$(this.el).html(this.resourseListTemp({}));
			}
		});
		
		var resourceList = null;
		
		this.onInitialized = function() {
			
			fu.msg.resourceChange.add(self.onResourceChange);
		    fu.msg.resourceSelected.add(self.onResourceSelected);
			
			resourceList = new ResourseListView();
			$("#resource-list-block").append(resourceList.el);
			
			fu.msg.resourceFilterChanged.dispatch();
		}
	    
		this.onResourceSelected = function(resourceKey) {
			$("#resource-list-block .selected").removeClass("selected");
			$("#"+resourceKey).addClass("selected");
			selectedResource = resourceKey;
		}
		
		this.onResourceChange = function() {
			ResourseListModel.fetch();
		}
		
		this.hasSelectedResource = function() {
			if(!selectedResource)
				return false;
			
			return true;
		}
		
		this.getSelectedResource = function() {
			return selectedResource;
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return resourceListModule;
})();
fu.models['resourceList'] = new ResourceListModule();