
var ResourceModule = (function () {
	
	var resourceModule = function() {
		var that = this;
		var resourceList = null;
		var resourceListView = null;
		//new ResourceCollection();
		
		var currentResourceForm = null;
		var currentResourceFormView = null;
		
		var selectedResources = [];
		
		//MESSAGES
		fu.msg.newResource = new signals.Signal();
		fu.msg.extendResource = new signals.Signal();
		fu.msg.editResource = new signals.Signal();
	    fu.msg.deleteResource = new signals.Signal();
		fu.msg.resourceChange = new signals.Signal();
		fu.msg.resourceSelectChange = new signals.Signal();
		fu.msg.updateResourceFilters = new signals.Signal();
		fu.msg.updateResourceFiltersComplete = new signals.Signal();
		
		this.onJQueryReady = function() {
			
			
		};
		
		this.onInitialized = function() {
			
			fu.msg.newResource.add(that.onNewResource);
			fu.msg.extendResource.add(that.onExtendResource);
			fu.msg.editResource.add(that.onEditResource);
			fu.msg.deleteResource.add(that.onDeleteResource);
			fu.msg.resourceChange.add(that.onResourceChange);
			fu.msg.worldChanged.add(that.onResourceChange);
			fu.msg.resourceSelectChange.add(that.onResourceSelectChange);
			fu.msg.updateResourceFilters.add(that.onUpdateResourceFilters);
			
			resourceList = new ResourceListForm();
			resourceListView = new Backbone.Form({
			    model: resourceList
			});
			
			resourceList.on('sync', function() {
				$(resourceListView.el).html("");
				resourceListView.render();
				$('#resource-list-block .block__body').append(resourceListView.el);
				
				var t = setTimeout(function(){
					$('#resource-list-block').selectableTable();
					$('#resource-list-block').on('selectChanged', function() {
						fu.msg.resourceSelectChange.dispatch();
					});
					fu.msg.resourceSelectChange.dispatch();
					fu.msg.updateResourceFiltersComplete.dispatch();
				},1000);
				
			}, this);
			resourceList.on('error', function() {
				alert("resourceList save error");
			});
			
			resourceList.fetch();
		};
	    
		this.hasSelectedResource = function() {
			
			if(selectedResources.length < 1)
				return false;
			
			return true;
		};
		
		this.getSelectedResource = function() {
			
			if(selectedResources.length < 1)
				return null;
			
			return selectedResources[0];
		};
		
		this.onNewResource = function() {
			
			currentResourceForm = new ResourceForm();
			currentResourceFormView = new Backbone.Form({
			    model: currentResourceForm
			});
			
			currentResourceFormView.render();
			var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
			fu.openModal("New resource", currentResourceFormView.el, controls);
		};
		
		this.onExtendResource = function() {
			
			if(!that.hasSelectedResource())
				return;
				
			currentResourceForm = new ResourceForm();
			currentResourceForm.url = "/resource/" + that.getSelectedResource() +"/";
			currentResourceFormView = new Backbone.Form({
			    model: currentResourceForm
			});
			
			currentResourceForm.on('sync', function() {
				$(currentResourceFormView.el).html("");
				currentResourceFormView.render();
				var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
				fu.openModal("Extend resource", currentResourceFormView.el, controls);
			}, this);
			currentResourceForm.fetch();
		};
		
		this.onEditResource = function() {
			
			if(!that.hasSelectedResource())
				return;
			
			currentResourceForm = new ResourceForm();
			currentResourceForm.url = "/resource/" + that.getSelectedResource() +"/";
			currentResourceForm.id = that.getSelectedResource();//by seetting id we force a put action
			currentResourceFormView = new Backbone.Form({
			    model: currentResourceForm
			});
			
			currentResourceForm.on('sync', function() {
				$(currentResourceFormView.el).html("");
				currentResourceFormView.render();
				var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
				fu.openModal("Edit resource", currentResourceFormView.el, controls);
			}, this);
			currentResourceForm.fetch();
		};
		
	    this.onDeleteResource = function() {
	    	
	    	if(selectedResources.length < 1)
				return;
	    	
	    	var filters = '';
	    	_.each(selectedResources, function(element, index) {
	    		if(index > 0)
	    			filters += '&';
	    		
	    		hexString = element.toString(16);
	    		filters += 'filter=' + hexString;
	    	});
	    	
	    	$.ajax({
    		   url: '/resource/?'+filters,
    		   type: 'DELETE',
    		   success: function() {
    			   resourceList.fetch();
    		   },
    		   error: function() {
    			   alert('error');
    		   }
	    	});
	    };
	    
		this.onSaveResource = function() {
			
			var currForm = currentResourceForm;
			var currFormView = currentResourceFormView;
			var errors = currentResourceFormView.commit();
			
			if(!errors) {
				currentResourceForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not save data.\
						</div>\
					');
				});
				currentResourceForm.on('sync', function() {
					fu.models['resource'].onResourceSaveComplete();
				});
				currentResourceForm.save();	
			}
		}
		
		this.onResourceSaveComplete = function() {
			currentResourceForm = null;
			currentResourceFormView = null;
			fu.closeModal();
			fu.msg.resourceChange.dispatch();
		}
		
		this.onResourceChange = function() {
			resourceList.fetch();
		}
		
		this.onResourceSelectChange = function() {
			
			selectedResources = [];
			$('#resource-list-block .selected').each(function() {
				selectedResources.push($(this).attr('id'));
			});
			
			if(selectedResources.length < 1) {
				$('#main_menu_item_delete_resource').addClass("disabled");
				$('#main_menu_item_extend_resource').addClass("disabled");
				$('#main_menu_item_edit_resource').addClass("disabled");
			}
			else {
				$('#main_menu_item_delete_resource').removeClass("disabled");
				$('#main_menu_item_extend_resource').removeClass("disabled");
				$('#main_menu_item_edit_resource').removeClass("disabled");
			}
		}
		
		this.onUpdateResourceFilters = function() {
			
			var errors = resourceListView.commit();
			
			if(!errors) {
				resourceList.save();
			}
			
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return resourceModule;
})();
fu.models['resource'] = new ResourceModule();