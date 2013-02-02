jQuery(document).ready(function($) {
	console.log("views.js");
	$('#diagram-control-block').append('<div id="diagram-simulator-control-buttons">');
	var map = $('#map');
	map.append('<svg id="svgmap" width="100%" height="100%"></svg>');
	mouseclick.init();
	mousewheel.init();
});