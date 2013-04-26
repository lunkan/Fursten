//Version: 1.0.0

var mouse = {}

mouse.transform_map = function(deltaX, deltaY) {
	var svgmap = d3.select("#svgmap");
    deltaX = deltaX || 0;
	deltaY = deltaY || 0;
		
	svgmap.selectAll(".map_node")
    .attr("transform", 
		  translate_map(deltaX, deltaY));
	svgmap.selectAll("#mappath")
	.attr("transform", 
		  translate_map(deltaX, deltaY));
	svgmap.selectAll(".map_collector")
    .attr("transform", 
		  translate_map(deltaX, deltaY));
	svgmap.selectAll("#background")
    .attr("transform", 
		  translate_map(deltaX, deltaY));
}

mouse.mouse_over_node = function(text) {
	var text_element = d3.select("#show_node_name").text(text);
	var text_box = d3.select('#show_node_name_box');
	var bb = text_element.node().getBBox();
	text_box.attr('x', bb.x - 4)
            .attr('y', bb.y)
            .attr('width', bb.width + 8)
            .attr('height', bb.height);
}

mouse.get_mouse_position = function(event) {
    var xpos = event.pageX - $('#map').offset().left; // no offsetX in firefox
    var ypos = event.pageY - $('#map').offset().top;
	var x_map = (xpos - map_view.X)/map_view.get_scale();
	var y_map = (ypos - map_view.Y)/map_view.get_scale();
	return {x: x_map, y: y_map};
}

var mousewheel = {}

mousewheel.init = function() {
	var map = document.getElementById('map');
	if (map.addEventListener) {
		map.addEventListener("mousewheel", this.handler, false);
		map.addEventListener("DOMMouseScroll", this.handler, false); //firefox
	}
}

mousewheel.handler = function(event) {
	var delta = event.wheelDelta || -event.detail; // detail firefox negative
	var sign = delta > 0 ? 1 : delta < 0 ? -1 : 0; //sign
	map_view.change_scale(sign);
	mouse.transform_map();
	if(event.preventDefault) {
		event.preventDefault();
	}
	return false;
}

var mouseclick = {};

mouseclick.modes = {
		UP: "UP",
		DOWN: "DOWN",
		PUT_COLLECTOR: "PUT_COLLECTOR"
}

mouseclick.mode = mouseclick.modes.UP;

mouseclick.startX = null;
mouseclick.startY = null;

mouseclick.init = function() {
	var map = $("#svgmap");
	var svgmap = d3.select("#svgmap");
	map.mousedown(function(event){
		console.log(event);
		if (event.button == 0) {
			if (event.ctrlKey) {
				if (fu.models['resource'].hasSelectedResource()) {
					console.log(fu.models['resource'].getSelectedResource());
					var mouse_coords = mouse.get_mouse_position(event);
					var x_map = mouse_coords.x;
					var y_map = mouse_coords.y;
					var data = JSON.stringify({"nodes":[{r :fu.models['resource'].getSelectedResource(), x: x_map, y: y_map}]});
					$.ajax ({
					    url: '/node/set',
					    type: "POST",
					    data: data,
					    dataType: "json",
					    contentType: "application/json",
					    success: function(data){
							svgmap.append('rect')
							  .attr('class', 'map_collector')
						      .attr('x', x_map - 120)
						      .attr('y', y_map - 120)
						      .attr('width', 240)
						      .attr('height', 240)
						      .attr('fill', 'yellow')
						      .attr('stroke', 'black')
						      .attr('stroke-width', 40)
						      .attr("transform", 
					   		   translate_map());
						}
					});
//					$.post('/node/set', data, function(data){
//						svgmap.append('rect')
//						  .attr('class', 'map_collector')
//					      .attr('x', x_map - 120)
//					      .attr('y', y_map - 120)
//					      .attr('width', 240)
//					      .attr('height', 240)
//					      .attr('fill', 'yellow')
//					      .attr('stroke', 'black')
//					      .attr('stroke-width', 40)
//					      .attr("transform", 
//				   		   translate_map());
//					});
				}
			} else if (mouseclick.mode === mouseclick.modes.UP) {
				mouseclick.mode = mouseclick.modes.DOWN;
				mouseclick.startX = event.pageX;
				mouseclick.startY = event.pageY;
				if(event.preventDefault) {
					event.preventDefault();
				}
				return false;
			} else if (mouseclick.mode == mouseclick.modes.PUT_COLLECTOR) {
				mouseclick.mode = mouseclick.modes.UP;
				d3.select('#put_cursor').remove();
				var mouse_coords = mouse.get_mouse_position(event);
				var x_map = mouse_coords.x;
				var y_map = mouse_coords.y;
				$.post('/postcollector/', {'x': x_map, 'y': y_map}, function(data){
					svgmap.append('rect')
					  .attr('class', 'map_collector')
				      .attr('x', x_map - 120)
				      .attr('y', y_map - 120)
				      .attr('width', 240)
				      .attr('height', 240)
				      .attr('fill', 'yellow')
				      .attr('stroke', 'black')
				      .attr('stroke-width', 40)
				      .attr("transform", 
			   		   translate_map());
				});
			}
		}
	});
	map.mousemove(function(event){
		if (mouseclick.mode == mouseclick.modes.PUT_COLLECTOR) {
			d3.select('#put_cursor').remove();
			var mouse_coords = mouse.get_mouse_position(event);
			var x_map = mouse_coords.x;
			var y_map = mouse_coords.y;
			svgmap.append('rect')
			      .attr('class', 'map_collector')
			      .attr('id', 'put_cursor')
			      .attr('x', x_map - 120)
			      .attr('y', y_map - 120)
			      .attr('width', 240)
			      .attr('height', 240)
			      .attr('fill', 'yellow')
			      .attr('stroke', 'black')
			      .attr('stroke-width', 40)
			      .attr('fill-opacity', 0.2)
			      .attr("transform", 
		   		   translate_map());
			      
			if(event.preventDefault) {
				event.preventDefault();
			}
			return false;
		}
	});
	
	var html = $("html");
	html.mousemove(function(event){
		if (event.button == 0) {
			if (mouseclick.mode == mouseclick.modes.DOWN) {
				var deltaX = event.pageX - mouseclick.startX;
				var deltaY = event.pageY - mouseclick.startY;
				mouse.transform_map(deltaX, deltaY);
			}
			if(event.preventDefault) {
				event.preventDefault();
			}
			return false;
		}
	});
	html.mouseup(function(event){
		if (event.button == 0) {
			if (mouseclick.mode == mouseclick.modes.DOWN) {
				var deltaX = event.pageX - mouseclick.startX;
				var deltaY = event.pageY - mouseclick.startY;
				map_view.X += deltaX
				map_view.Y += deltaY
				mouse.transform_map();
				mouseclick.mode = mouseclick.modes.UP;
			}
			if(event.preventDefault) {
				event.preventDefault();
			}
			return false;
		}
	});
}

mouseclick.put_collector = function() {
	d3.select('#put_cursor').remove();
	if (mouseclick.mode == mouseclick.modes.PUT_COLLECTOR) {
		mouseclick.mode = mouseclick.modes.UP;
	} else {
		mouseclick.mode = mouseclick.modes.PUT_COLLECTOR;
	}
}



