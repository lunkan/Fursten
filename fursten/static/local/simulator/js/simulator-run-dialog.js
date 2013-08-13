
var SimulatorRunDialogModule = (function () {
	
	var simulatorRunDialogModule = function() {
		
		var self = this;
		
		//MESSAGES
		fu.msg.runSimulator = new signals.Signal();
		fu.msg.runProcessComplete = new signals.Signal();
		
		this.onInitialized = function() {
			fu.msg.runSimulator.add(self.onRunSimulator);
		};
		
		this.runControlDialogTemplate = _.template('\
			<form id="id_rundialog">\
				<fieldset>\
					<div class="input-group">\
						<input id="id_ticks" name="ticks" type="number" min="1" max="100" step="1" value="1" class="form-control">\
						<span class="input-group-btn">\
							<button id="id_runcontrol" class="btn btn-default" type="button"><span class="glyphicon glyphicon-play"></span></button>\
						</span>\
					</div>\
				</fieldset>\
			<form>\
		');
		
		this.onRunSimulator = function() {
			
			var d1= moment();
			var $form = $($.trim(self.runControlDialogTemplate({})));
			
			//Dialog states
			$form.on('sleep', function(e) {
				
				//Wait until ready if busy running
				if($form.hasClass('busy')) {
					$form.addClass('forceSleep')
					return;
				}
				
				//Enable controls
				$form.removeClass('forceSleep');
				$(this).find('input[name="ticks"]').prop('disabled', false);
				$(this).find('#id_runcontrol').prop('disabled', false);
				
				//Tell other modules that changes occur
				fu.msg.runProcessComplete.dispatch();
			});
			$form.on('run', function(e){
				
				var $form = $(this); 
				$(this).find('input[name="ticks"]').prop('disabled', true);
				$(this).find('#id_runcontrol').prop('disabled', false);
				
				var csrftoken = $.cookie('csrftoken');
				$.ajax({
					url: '/simulator/run/',
		    		type: 'POST',
		    		beforeSend: function(xhr, settings) {
		    			
		    			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
				        	xhr.setRequestHeader("X-CSRFToken", csrftoken);
				        }
		    			$form.addClass('busy');
		    		},
		    		success: function() {
		    			
		    			var tick = parseInt($form.find('input[name="ticks"]').val()) -1;
		    			$form.find('input[name="ticks"]').val(tick);
		    			
		    			//Run next if ticks to run and sleep is not called
		    			if(tick > 0 && !$form.hasClass('forceSleep')) {
		    				$form.trigger('run');
		    			} else {
		    				$form.removeClass('busy');
		    				
		    				var $control = $($form.find('#id_runcontrol'));
		    				$control.prop('disabled', true);
		    				$control.html('<span class="glyphicon glyphicon-play">');
		    				$control.attr('toggle', 'run');
		    				$form.trigger('sleep');
		    			}
		    		},
		    		error: function() {
		    			alert('run error');
		    		}
			    });
			});
			
			//Dialog play/pause control
			$form.find('#id_runcontrol').click(function() {
				
				if($(this).attr('toggle') == 'sleep') {
					$(this).prop('disabled', true);
					$(this).html('<span class="glyphicon glyphicon-play">');
					$(this).attr('toggle', 'run');
					$form.trigger('sleep');
				} else {
					$(this).prop('disabled', true);
					$(this).html('<span class="glyphicon glyphicon-pause">');
					$(this).attr('toggle', 'sleep');
					$form.trigger('run');
				}
			})
			
			fu.openModal('Run simulator', $form, [{
					label:"Close",
					callback: function() {
						$form.trigger('sleep');
						fu.closeModal();
					}
				}] ,{
				small:true
			});
		}
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.initialized.add(this.onInitialized);
	}
	
	return simulatorRunDialogModule;
})();
fu.models['simulatorRunDialogModule'] = new SimulatorRunDialogModule();