var Fursten = (function () {
	
	var fursten = function() {
	
		var that = this;
		this.msg = {
			jQueryReady : new signals.Signal(),
			initialized : new signals.Signal()
		};
		this.models = {}
		
		this.init = function() {
			that.msg.jQueryReady.dispatch();
			that.msg.initialized.dispatch();
		}
		
		this.getBaseUrl = function() {
			if(window.location.port)
				return window.location.protocol + "//" + document.domain + ":" + window.location.port;
			else
				return window.location.protocol + "//" + document.domain;
		}
	}
	
	return fursten;
})();

var fursten = new Fursten();

$(function(){
	
	jQuery(document).ready(function($) {
		fursten.init();
	});
});
