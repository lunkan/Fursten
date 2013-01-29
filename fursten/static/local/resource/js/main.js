
var ResourceModule = (function () {
	
	var resourceModule = function() {
		var that = this;
		var resourceList = new ResourceCollection();
		
		var currentResourceForm = null;
		var currentResourceFormView = null;
		
		//MESSAGES
		fu.msg.newResource = new signals.Signal();
		fu.msg.resourceChange = new signals.Signal();
		
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
			
			currentResourceFormView.render();
			var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
			fu.openModal("New resource", currentResourceFormView.el, controls);
			
			
			/*currentResourceForm.on('sync', function() {
				currentResourceFormView.render();
				var controls = [{callback:fu.models['resource'].onSaveResource, label:"Save"}];
				fu.openModal("New resource", currentResourceFormView.el, controls);
			}, this);
			currentResourceForm.fetch();*/
		};
		
		this.onSaveResource = function() {
			
			var currForm = currentResourceForm;
			var currFormView = currentResourceFormView;
			var errors = currentResourceFormView.commit();
			
			if(!errors) {
				currentResourceForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not save date.\
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
			//alert("on change");
			resourceList.fetch();
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
		fu.msg.newResource.add(this.onNewResource);
		fu.msg.resourceChange.add(this.onResourceChange);
	}
	
	return resourceModule;
})();
fu.models['resource'] = new ResourceModule();