
var WorldModule = (function () {
	
	var worldModule = function() {
	
		var that = this;
		
		var currentWorldForm = null;
		var currentWorldFormView = null;
		
		var worldStatus = null;
		var worldStatusView = null;
		
		var processStates = ["play", "pause", "stop"];
		var processCurrentState = processStates[2];
		var ticksToRunValue = 0;
		var currentRunTick = 0;
		
		//MESSAGES
		fu.msg.newWorld = new signals.Signal();
		fu.msg.worldChanged = new signals.Signal();
		fu.msg.playProcess = new signals.Signal();
		fu.msg.pauseProcess = new signals.Signal();
		fu.msg.stopProcess = new signals.Signal();
		fu.msg.runProcessStarted = new signals.Signal();
		fu.msg.runProcessComplete = new signals.Signal();
		fu.msg.runProcessNext = new signals.Signal();
		fu.msg.runProcessNextComplete = new signals.Signal();
		
		this.onJQueryReady = function() {
			//...
		};
		
		this.onInitialized = function() {
			
			
			$("#run-progress-bar").hide();
			
			worldStatus = new WorldStatus();
			worldStatusView = new Backbone.Form({
			    model: worldStatus
			});
			
			worldStatus.on('sync', function() {
				$(worldStatusView.el).html("");
				worldStatusView.render();
				$('#process-status-block .block__body').append(worldStatusView.el);
				
				//Ugly as hell - make better later :)
				var tick = worldStatus.toJSON().worldStatus[0].tick;
				$("#current-tick-display").html(tick);
				
			}, this);
			worldStatus.on('error', function() {
				alert("resourceList save error");
			});
			
			worldStatus.fetch();
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
			worldStatus.fetch();
		}
		
		this.onPlayProcess = function() {
			
			if(processCurrentState == processStates[0]) {
				return;//already playing
			}
			else if(processCurrentState == processStates[1]) {
				processCurrentState = processStates[1];
			}
			else if(processCurrentState == processStates[2]) {
				processCurrentState = processStates[0];
				fu.msg.runProcessStarted.dispatch();
				that.runProcess();
			}
			
			fu.msg.runProcessComplete = new signals.Signal();
			fu.msg.runProcessNext = new signals.Signal();
			
		}
		
		this.onPauseProcess = function() {
			//..
		}
		
		this.onStopProcess = function() {
			//..
		}
		
		this.runProcess = function() {
			
			if(processCurrentState == processStates[1]) {
				return;//pausing
			}
			else if(ticksToRunValue <= currentRunTick) {
				that.onRunProcessComplete();
				return;
			}
			
			$.ajax({
				url: '/world/run/',
	    		type: 'POST',
	    		success: function() {
	    			fu.models['world'].onRunProcessNext();
	    		},
	    		error: function() {
	    			alert('run error');
	    		}
		    });
		}
		
		this.onRunProcessStarted = function() {
			var ticksToRunValueStr = $('input[name=ticksToRun]').val();
			ticksToRunValue = parseInt(ticksToRunValueStr);
			currentRunTick = 0;
			$('input[name=ticksToRun]').prop('disabled', true);
		}
		
		this.onRunProcessNext = function() {
			
			currentRunTick++;
			var currentTickValue = ticksToRunValue - currentRunTick;
			var percent = (100 - (currentTickValue/ticksToRunValue) * 100) + "%";
			
			$("#run-progress-bar").show();
			$("#run-progress-bar .bar").css({
				width: percent
			});
			
			var self = that;
			setTimeout(function(){
				fu.msg.runProcessNext.dispatch();
				self.runProcess();
			},100);
		}
		
		this.onRunProcessComplete = function() {
			
			ticksToRunValue = 0;
			currentRunTick = 0;
			$('input[name=ticksToRun]').val("");
			$('input[name=ticksToRun]').prop('disabled', false);
			
			worldStatus.fetch();
			
			$("#run-progress-bar").hide();
			processCurrentState = processStates[2];
			fu.msg.runProcessComplete.dispatch();
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.jQueryReady.add(this.onJQueryReady);
		fu.msg.initialized.add(this.onInitialized);
		fu.msg.newWorld.add(this.onNewWorld);
		fu.msg.playProcess.add(this.onPlayProcess);
		fu.msg.pauseProcess.add(this.onPauseProcess);
		fu.msg.stopProcess.add(this.onStopProcess);
		fu.msg.runProcessStarted.add(this.onRunProcessStarted);
		//fu.msg.runProcessComplete.add(this.onRunProcessComplete);
	}
	
	return worldModule;
})();

fu.models['world'] = new WorldModule();