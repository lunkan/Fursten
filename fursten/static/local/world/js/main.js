
var WorldModule = (function () {
	
	var worldModule = function() {
	
		var that = this;
		
		var currentWorldForm = null;
		var currentWorldFormView = null;
		
		//MESSAGES
		fu.msg.newWorld = new signals.Signal();
		fu.msg.newWorldConfirmed = new signals.Signal();
		fu.msg.newWorldCompleted = new signals.Signal();
		fu.msg.worldChanged = new signals.Signal();
		
		this.onJQueryReady = function() {
			//...
		};
		
		this.onInitialized = function() {
			//...
		};
	    
		this.onNewWorld = function() {
			
			currentWorldForm = new WorldForm();
			currentWorldFormView = new Backbone.Form({
			    model: currentWorldForm
			});
			
			currentWorldForm.on('sync', function() {
				currentWorldFormView.render();
				var controls = [{action:'onClick="fu.msg.newWorldConfirmed.dispatch()"', label:"Confirm"}];
				fu.openModal("New world", currentWorldFormView.el, controls);
			}, this);
			currentWorldForm.fetch();
		};
		
		this.onNewWorldConfirmed = function() {
			
			var currForm = currentWorldForm;
			var currFormView = currentWorldFormView;
			var errors = currentWorldFormView.commit();
			if(!errors) {
				currentWorldForm.on('sync', function() {
					fu.msg.newWorldCompleted.dispatch();
				});
				currentWorldForm.save();	
			}
		}
		
		this.onNewWorldCompleted = function() {
			currentWorldForm = null;
			currentWorldFormView = null;
			fu.closeModal();
			fu.msg.worldChanged.dispatch();
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.newWorld.add(this.onNewWorld);
		fu.msg.newWorldConfirmed.add(this.onNewWorldConfirmed);
		fu.msg.newWorldCompleted.add(this.onNewWorldCompleted);
		//fu.msg.worldChanged.add();
	}
	
	return worldModule;
})();

fu.models['world'] = new WorldModule();