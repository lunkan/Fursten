
var PlayerModule = (function () {
	var playerModule = function() {
		
		var currentNewPlayerForm = null;
		var currentNewPlayerFormView = null;
		var that = this;

		//MESSAGES
		fu.msg.newPlayer = new signals.Signal();
		
		
		this.onNewPlayer = function() {
			currentNewPlayerForm = new NewPlayerForm();
			currentNewPlayerFormView = new Backbone.Form({
			    model: currentNewPlayerForm
			});
			
			currentNewPlayerFormView.render();
			var controls = [{callback:fu.models['player'].onCreatePlayer, label:"Create"}];
			fu.openModal("New player", currentNewPlayerFormView.el, controls);
		};
		
		
		this.onCreatePlayer = function() {
			
			var currForm = currentNewPlayerForm;
			var currFormView = currentNewPlayerFormView;
			var errors = currentNewPlayerFormView.commit();
			
			if(!errors) {
				currentNewPlayerForm.on('error', function() {
					$(currFormView.el).prepend('<div class="alert alert-error">\
						<button type="button" class="close" data-dismiss="alert">&times;</button>\
						<strong>Warning!</strong> Could not create player.\
						</div>\
					');
				});
				currentNewPlayerForm.on('sync', function() {
					fu.models['player'].onCreatePlayerComplete();
				});
				currentNewPlayerForm.save();	
			}
		};
		
		this.onCreatePlayerComplete = function() {
			currentCreatePlayerForm = null;
			currentCreatePlayerFormView = null;
			fu.closeModal();
//			fu.msg.resourceChange.dispatch();
		}
	
		//SUBSCRIBE TO MESSAGES
		//fu.msg.drawMap.add(this.ondrawMap);
		fu.msg.newPlayer.add(this.onNewPlayer);
		
	};
	
	
	return playerModule;
})();
fu.models['player'] = new PlayerModule();
