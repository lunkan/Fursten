
var ProjectSaveModule = (function () {
	
	var projectSaveModule = function() {
		
		var self = this;
		
		//MESSAGES
		fu.msg.save = new signals.Signal();
		fu.msg.load = new signals.Signal();
	    
		this.onInitialized = function() {
			fu.msg.save.add(self.onSaveProject);
			fu.msg.load.add(self.onLoadProject);
		};
			
		this.onSaveProject = function() {
				
			var csrftoken = $.cookie('csrftoken');
			$.ajax({
				url: '/project/save/',
	    		type: 'POST',
	    		beforeSend: function(xhr, settings) {
	    			
	    			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
			        	xhr.setRequestHeader("X-CSRFToken", csrftoken);
			        }
	    			
	    			var title = "Saving project";
	    			var $progressbar = $('\
		    			<div class="progress progress-striped active">\
		    			  <div class="bar" style="width: 0%;"></div>\
	    				  <p id="id_saveStatusLabel">Saving project. Please wait.</p>>\
		    			</div>\
	    			');
	    			
	    			//Create form, controls and callback functions
	    			fu.openModal(
	    				title,
	    				$progressbar, [],
	    				{small:true}
	    			);
	    			
	    		},
	    		success: function() {
	    			$("#id_saveStatusLabel").html("Saving completed!");
	    		},
	    		error: function() {
	    			alert('Unable to save');
	    		}
		    });
		};
		
		this.onLoadProject = function() {
			
			var csrftoken = $.cookie('csrftoken');
			$.ajax({
				url: '/project/load/',
	    		type: 'POST',
	    		beforeSend: function(xhr, settings) {
	    			
	    			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
			        	xhr.setRequestHeader("X-CSRFToken", csrftoken);
			        }
	    			
	    			var title = "Loading project";
	    			var $progressbar = $('\
		    			<div class="progress progress-striped active">\
		    			  <div class="bar" style="width: 0%;"></div>\
	    				  <p id="id_loadStatusLabel">Loading project. Please wait.</p>>\
		    			</div>\
	    			');
	    			
	    			//Create form, controls and callback functions
	    			fu.openModal(
	    				title,
	    				$progressbar, [],
	    				{small:true}
	    			);
	    			
	    		},
	    		success: function() {
	    			$("#id_loadStatusLabel").html("Loading completed!");
	    			fu.msg.resourceChange.dispatch();
	    		},
	    		error: function() {
	    			alert('Unable to Load');
	    		}
		    });
		};
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return projectSaveModule;
})();
fu.models['projectSave'] = new ProjectSaveModule();