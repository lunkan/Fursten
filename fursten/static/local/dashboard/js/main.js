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
		
		this.openModal = function(title, bodyElement, controls, options) {
			
			$('#myModal .modal-body').empty();
			$('#myModal .modal-footer').empty();
			$('#myModal .modal-header h4').html(title);
			$('#myModal .modal-body').append(bodyElement);
			$('#myModal').removeClass('large');
			$('#myModal').removeClass('small');
			
			$.each(controls, function(index, control) {
				var classes = "btn";
				if(index == 0)
					classes += " btn-primary";
				
				var btnElm = $('<a class="' + classes + '">' + control.label + '</a>');
				$(btnElm).click(control.callback);
				$('#myModal .modal-footer').append(btnElm);
			});
			
			if(options) {
				if(options.large) {
					$('#myModal').addClass('large');
				} else if(options.small) {
					$('#myModal').addClass('small');
				}
			}
			
			$('#myModal').modal('show');
		};
		
		this.closeModal = function() {
			$('#myModal').modal('hide');
			$('#myModal').removeClass('large');
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
