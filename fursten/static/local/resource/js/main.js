
var ResourceModule = (function () {
	
	var resourceModule = function() {
		var that = this;
		var resourceList = null;
		var resourceListView = null;
		//new ResourceCollection();
		
		var currentResourceForm = null;
		var currentResourceFormView = null;
		
		//MESSAGES
		fu.msg.newResource = new signals.Signal();
		fu.msg.resourceChange = new signals.Signal();
		
		this.onJQueryReady = function() {
			
			
		};
		
		this.onInitialized = function() {
			
			fu.msg.newResource.add(that.onNewResource);
			fu.msg.resourceChange.add(that.onResourceChange);
			fu.msg.worldChanged.add(that.onResourceChange);
			
			resourceList = new ResourceListForm();
			resourceListView = new Backbone.Form({
			    model: resourceList
			});
			
			resourceList.on('sync', function() {
				resourceListView.render();
				$('#resource-list-block .block__body').append(resourceListView.el);
			}, this);
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
			//alert("on change");
			resourceList.fetch();
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return resourceModule;
})();
fu.models['resource'] = new ResourceModule();