jQuery(document).ready(function($) {
	$('#diagram-list-block').append('THIS IS SOME TEXT');
	
	var map = $('#map');
	map.append('<svg id="svgmap" width="100%" height="100%"></svg>');
	$.getJSON("/diagram/getcss", 
		function(data) {
		$("#node_style").html(data.css);
	});
	mouseclick.init();
	mousewheel.init();
	
	fu.msg.testSignal.dispatch();
});