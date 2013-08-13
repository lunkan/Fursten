
var SimulatorMasterModule = (function () {
	
	var simulatorMasterModule = function() {
		
		var self = this;
		
		//MESSAGES
		fu.msg.clearNodes = new signals.Signal();
		
		this.onInitialized = function() {
			fu.msg.clearNodes.add(self.onClearNodes);
		};
		
		this.onClearNodes = function() {
			
			var csrftoken = $.cookie('csrftoken');
			$.ajax({
				url: '/simulator/clearnodes/',
	    		type: 'POST',
	    		beforeSend: function(xhr, settings) {
	    			
	    			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
			        	xhr.setRequestHeader("X-CSRFToken", csrftoken);
			        }
	    		},
	    		success: function() {
	    			fu.msg.nodesChange.dispatch();
	    		},
	    		error: function() {
	    			alert('run error');
	    		}
		    });
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return simulatorMasterModule;
})();
fu.models['simulatorMasterModule'] = new SimulatorMasterModule();