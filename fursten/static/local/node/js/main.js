
var NodeModule = (function () {
	
	var nodeModule = function() {
		
		var that = this;
		
		var currentNodeForm = null;
		var currentNodeFormView = null;
		
		//MESSAGES
		fu.msg.newNodes = new signals.Signal();
		fu.msg.deleteNodes = new signals.Signal();
		fu.msg.setNodes = new signals.Signal();
		fu.msg.clearNodes = new signals.Signal();
		fu.msg.nodesChange = new signals.Signal();
		
		this.onJQueryReady = function() {
			//...
		};
		
		this.onInitialized = function() {
			fu.msg.newNodes.add(that.onNewNodes);
			fu.msg.deleteNodes.add(that.onDeleteNodes);
			fu.msg.setNodes.add(that.onSetNodes);
			fu.msg.clearNodes.add(that.onClearNodes);
		};
	    
		this.onNewNodes = function() {
			
			currentNodeForm = new NodeForm();
			currentNodeForm.url = "/node/inject";
			currentNodeFormView = new Backbone.Form({
			    model: currentNodeForm
			});
			
			currentNodeFormView.render();
			var controls = [{callback:fu.models['node'].onSaveNodes, label:"Save"}];
			fu.openModal("New Nodes", currentNodeFormView.el, controls);
		};
		
	    this.onDeleteNodes = function() {
	    	
	    	currentNodeForm = new NodeForm();
	    	currentNodeForm.url = "/node/remove";
			currentNodeFormView = new Backbone.Form({
			    model: currentNodeForm
			});
			
			currentNodeFormView.render();
			var controls = [{callback:fu.models['node'].onSaveNodes, label:"Save"}];
			fu.openModal("Delete Nodes", currentNodeFormView.el, controls);
	    };
	    
	    this.onSetNodes = function() {
	    	alert("hello");
	    	currentNodeForm = new NodeForm();
	    	currentNodeForm.url = "/node/set";
			currentNodeFormView = new Backbone.Form({
			    model: currentNodeForm
			});
			
			currentNodeFormView.render();
			var controls = [{callback:fu.models['node'].onSaveNodes, label:"Save"}];
			fu.openModal("Set Nodes", currentNodeFormView.el, controls);
	    };
	    
	    this.onClearNodes = function() {
	    	
	    	$.ajax({
    		   url: '/node/',
    		   type: 'DELETE',
    		   success: function() {
    			   fu.msg.nodesChange.dispatch();
    		   },
    		   error: function() {
    			   alert('error');
    		   }
	    	});
	    };
	    
		this.onSaveNodes = function() {
			
			var currForm = currentNodeForm;
			var currFormView = currentNodeFormView;
			var errors = currentNodeFormView.commit();
			
			if(!errors) {
				currentNodeForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not save data.\
						</div>\
					');
				});
				currentNodeForm.on('sync', function() {
					fu.models['node'].onNodeSaveComplete();
				});
				currentNodeForm.save();	
			}
		};
		
		this.onNodeSaveComplete = function() {
			currentNodeForm = null;
			currentNodeFormView = null;
			fu.closeModal();
			fu.msg.nodesChange.dispatch();
		};
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return nodeModule;
})();
fu.models['node'] = new NodeModule();