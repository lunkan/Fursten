
var ResourceModule = (function () {
	
	var resourceModule = function() {
	
		var that = this;
		var resourceList = new ResourceCollection();
		
		var currentResourceForm = null;
		var currentResourceFormView = null;
		
		//MESSAGES
		fu.msg.newResource = new signals.Signal();
		fu.msg.saveResource = new signals.Signal();
		fu.msg.resourceChange = new signals.Signal();
		fu.msg.resourceSaveComplete = new signals.Signal();
		
		this.onJQueryReady = function() {
			
			var resourceListView = new recourceViews.ResourceListView({
				collection: resourceList,
				el: $('#resource-list-block .block-content')
			});
		};
		
		this.onInitialized = function() {
			resourceList.fetch();
		};
	    
		this.onNewResource = function() {
			
			currentResourceForm = new ResourceForm();
			currentResourceFormView = new Backbone.Form({
			    model: currentResourceForm
			});
			
			currentResourceForm.on('sync', function() {
				currentResourceFormView.render();
				var controls = [{action:'onClick="fu.msg.saveResource.dispatch()"', label:"Save"}];
				fu.openModal("New resource", currentResourceFormView.el, controls);
			}, this);
			currentResourceForm.fetch();
		};
		
		this.onSaveResource = function() {
			
			var currForm = currentResourceForm;
			var currFormView = currentResourceFormView;
			var errors = currentResourceFormView.commit();
			if(!errors) {
				currentResourceForm.on('sync', function() {
					fu.msg.resourceSaveComplete.dispatch();
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
			//alert("on change");
			resourceList.fetch();
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
		fu.msg.newResource.add(this.onNewResource);
		fu.msg.saveResource.add(this.onSaveResource);
		fu.msg.resourceChange.add(this.onResourceChange);
		fu.msg.resourceSaveComplete.add(this.onResourceSaveComplete);
	}
	
	return resourceModule;
})();

fu.models['resource'] = new ResourceModule();