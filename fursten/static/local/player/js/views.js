jQuery(document).ready(function($) {
	$.getJSON('/player/getactiveplayer', function(data) {
		console.log(data);
		fu.msg.setActivePlayer.dispatch(data);
	});


});