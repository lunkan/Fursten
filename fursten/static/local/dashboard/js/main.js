var Fursten = (function () {
	
	var fursten = function() {
	
		var that = this;
		this.msg = {
			jQueryReady : new signals.Signal(),
			initialized : new signals.Signal()
		};
		this.models = {};
		
		this.init = function() {
			that.msg.jQueryReady.dispatch();
			that.msg.initialized.dispatch();
		};
		
		this.getBaseUrl = function() {
			if(window.location.port)
				return window.location.protocol + "//" + document.domain + ":" + window.location.port;
			else
				return window.location.protocol + "//" + document.domain;
		};
		
		this.openModal = function(title, bodyElement, controls) {
			
			$('#myModal .modal-body').empty();
			$('#myModal .modal-footer').empty();
			$('#myModal .modal-header h3').html(title);
			$('#myModal .modal-body').append(bodyElement);
			
			$.each(controls, function(index, control) { 
				  if(index == 0)
					  $('#myModal .modal-footer').append('<a class="btn btn-primary" href="#" ' + control.action + ' >' + control.label + '</a>');
				  else
					  $('#myModal .modal-footer').append('<a class="btn" href="#" ' + control.action + ' >' + control.label + '</a>');
			});
			
			$('#myModal').modal('show');
		};
		
		this.closeModal = function() {
			$('#myModal').modal('hide');
		}
	}
	
	return fursten;
})();

var fu = new Fursten();

$(function(){
	
	jQuery(document).ready(function($) {
		fu.init();
	});
});
