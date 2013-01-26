function translate_map(deltaX, deltaY) {
    deltaX = deltaX || 0;
	deltaY = deltaY || 0;
	var X = map_view.X + deltaX;
	var Y = map_view.Y + deltaY;
	return 'translate(' + X + ' ' +Y + ') scale(' + map_view.get_scale() + ')';
}

function draw_map(paths) {
	var svgmap = d3.select("#svgmap");
	_.each(paths, function(path) {
		svgmap.append("path")
		    .attr("stroke", "black")
		    .attr("stroke-width", 10)
		    .attr("id", "mappath")
		    .attr("transform", 
		    		translate_map())
		    .attr("fill-rule", "evenodd")
		    .attr("class", "node_" + path[1])
		    .attr("d", path[0]);
    });
}

var map_view = {
		X: 250, 
		Y: 250, 
		scale: 1,
		scales: [0.012500000000000001, 0.014865088937534014, 0.017677669529663691, 
		         0.021022410381342865, 0.025000000000000001, 0.029730177875068028, 
		         0.035355339059327383, 0.042044820762685731, 0.050000000000000003, 
		         0.059460355750136057, 0.070710678118654766, 0.084089641525371461, 
		         0.10000000000000001, 0.11892071150027211, 0.14142135623730953, 
		         0.16817928305074292, 0.20000000000000001, 0.23784142300054423, 
		         0.28284271247461906, 0.33635856610148585, 0.40000000000000002, 
		         0.47568284600108846, 0.56568542494923812, 0.67271713220297169,
		         0.80000000000000004],
		get_scale: function() {
			return this.scales[this.scale];
		},
		change_scale: function(sign) {
			this.scale = Math.min(Math.max(0, this.scale + sign), this.scales.length);
		}
	};

var DiagramModule = (function () {
	console.log('DiagramModule');
	var diagramModule = function() {
		console.log('diagramModule');
		//MESSAGES
		fu.msg.testSignal = new signals.Signal();
		this.onTestSignal = function() {
			console.log('onTestSignal');
			$.getJSON('/diagram/getsvgjson', function(data) {
				console.log(data);
				draw_map(data.paths);
				var svgmap = d3.select("#svgmap");
				console.log(data);
				_.each(data.nodes, function(list,key) {
					_.each(list, function(xy){
						svgmap.append("circle")
						   .attr("class", "node_" + key + ' map_node')
						   .attr("cx", xy[0])
					       .attr("cy", xy[1])
						   .attr("r", 3/0.025)
						   .attr("stroke-width", 1/0.025)
						   .attr("transform", 
				    		  translate_map());
					});
					$(".node_" + key).mouseover(function() {
						mouse.mouse_over_node(key);
					});
				});
				var text_element = svgmap.append('text');
				text_element.text('')
				      .attr('x', 10)
				      .attr('y', 20)
				      .attr('id', 'show_node_name')
				      .attr('font-weight', 'bold')
				      .attr('font-size', 24);
				var bb = text_element.node().getBBox();
				svgmap.insert(('rect'), '#show_node_name')
				.attr('x', bb.x - 4)
			    .attr('y', bb.y)
			    .attr('width', bb.width + 8)
			    .attr('height', bb.height)
			    .attr('fill', 'white')
			    .attr('fill-opacity', 0.5)
			    .attr('id', 'show_node_name_box');

			});
		};
		//SUBSCRIBE TO MESSAGES
		fu.msg.testSignal.add(this.onTestSignal);
	};
	return diagramModule;
})();
console.log('main');
fu.models['diagram'] = new DiagramModule();
