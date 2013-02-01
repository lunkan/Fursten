
var WorldModule = (function () {
	
	var worldModule = function() {
	
		var that = this;
		
		var currentWorldForm = null;
		var currentWorldFormView = null;
		
		//MESSAGES
		fu.msg.newWorld = new signals.Signal();
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
				var controls = [{callback:fu.models['world'].onNewWorldConfirmed, label:"Confirm"}];
				fu.openModal("New world", currentWorldFormView.el, controls);
			}, this);
			currentWorldForm.fetch();
		};
		
		this.onNewWorldConfirmed = function() {
			
			var currForm = currentWorldForm;
			var currFormView = currentWorldFormView;
			var errors = currentWorldFormView.commit();
			if(!errors) {
				currForm.on('error', function() {
					$(currForm.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not save data.\
						</div>\
					');
				});
				currentWorldForm.on('sync', function() {
					fu.models['world'].onNewWorldCompleted();
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
	}
	
	return worldModule;
})();

fu.models['world'] = new WorldModule();