
var PlayerModule = (function () {
	var playerModule = function() {
		
		var currentNewPlayerForm = null;
		var currentNewPlayerFormView = null;
		var that = this;
		var activePlayer = false;

		//MESSAGES
		fu.msg.newPlayer = new signals.Signal();
		fu.msg.getPlayers = new signals.Signal();
		fu.msg.selectPlayer = new signals.Signal();
		fu.msg.setActivePlayer = new signals.Signal();
		fu.msg.putCollector = new signals.Signal();
		
		this.onGetPlayers = function() {
			$('.players_select').remove();
			$.getJSON('/player/getplayers', function(data) {
				data.forEach(function(player) {
					$('#main_menu_item_None').after(
							'<li class="players_select"><a onclick="fu.msg.selectPlayer.dispatch(' + player.id + ')">' + player.name + '</a></li>');
				});
			});
		};
		
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
		
		this.onSelectPlayer = function(playerId) {
			console.log(playerId);
			$.post('/player/selectplayer', {'id': playerId}, function(data) {
				console.log(data);
				fu.msg.setActivePlayer.dispatch(data);
			});
		};
		
		this.onCreatePlayerComplete = function() {
			currentCreatePlayerForm = null;
			currentCreatePlayerFormView = null;
			fu.closeModal();
			fu.msg.getPlayers.dispatch();
		}
		
		this.onSetActivePlayer = function(player) {
			var text;
			if (player.name === false) {
				 text = 'No player selected';
				 activePlayer = false;
			} else {
				html = 'Active player: ' + player.name + '<br>';
				html += 'Number of collectors: ' + player.collectorcount;
				activePlayer = player;
				$('#player_info').html(html);
				$('#player_controls').html('<button type="submit" class="btn btn-primary" onclick="fu.msg.putCollector.dispatch();">PLACE COLLECTOR</button>');
			}
		}
		
		this.onPutCollector = function() {
			if (mouseclick.mode != mouseclick.modes.PUT_COLLECTOR) {
				mouseclick.mode = mouseclick.modes.PUT_COLLECTOR;
			} else {
				mouseclick.mode = mouseclick.modes.UP;
			}
		}
	
		//SUBSCRIBE TO MESSAGES
		fu.msg.newPlayer.add(this.onNewPlayer);
		fu.msg.getPlayers.add(this.onGetPlayers);
		fu.msg.selectPlayer.add(this.onSelectPlayer);
		fu.msg.setActivePlayer.add(this.onSetActivePlayer);
		fu.msg.putCollector.add(this.onPutCollector);
		
	};
	
	
	return playerModule;
})();
fu.models['player'] = new PlayerModule();
fu.msg.getPlayers.dispatch();

