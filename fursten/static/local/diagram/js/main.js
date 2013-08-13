function translate_map(deltaX, deltaY) {
    deltaX = deltaX || 0;
	deltaY = deltaY || 0;
	var X = map_view.X + deltaX;
	var Y = map_view.Y + deltaY;
	return 'translate(' + X + ' ' +Y + ') scale(' + map_view.get_scale() + ')';
}

function draw_map(paths) {
	var svgmap = d3.select("#svgmap");
	svgmap.selectAll('#mappath').remove();
	_.each(paths, function(path) {
		svgmap.append("path")
		    .attr("stroke-width", 10)
		    .attr("id", "mappath")
		    .attr("transform", 
		    		translate_map())
		    .attr("fill-rule", "evenodd")
		    .attr("class", "node_" + path[1])
		    .attr('fill', path[2]['color'])
		    .attr('stroke', path[2]['border_color'])
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
	var diagramModule = function() {
		
		var currentConnectForm = null;
		var currentConnectFormView = null;
		this.running = false;
		this.showingDiagram = false;
		this.nodeCount = {};
		var that = this;
		console.log(that);
		//MESSAGES
		fu.msg.drawMap = new signals.Signal();
		fu.msg.startRunning = new signals.Signal();
		fu.msg.stopRunning = new signals.Signal();
		fu.msg.showDiagram = new signals.Signal();
		fu.msg.removeDiagram = new signals.Signal();
		
		
		this.onShowDiagram = function() {
			var map = $('#map');
			map.append('<svg id="svgdiagram" style="left: 50%; top: 0px; position: absolute;" width="50%" height="100%" viewBox="0 0 500 500"></svg>');
			var svgdiagram = d3.select("#svgdiagram");
			svgdiagram.append('rect')
			  .attr('id', 'diagrambackground')
		      .attr('x', 0)
		      .attr('y', 0)
		      .attr('width', "100%")
		      .attr('height', "100%")
		      .attr('fill', 'black');
			that.showingDiagram = true;
			that.drawDiagram();
			
		}
		
		this.drawDiagram = function(colors_for_nodes, tick) {
			
			console.log(colors_for_nodes);
			var svgdiagram = d3.select("#svgdiagram");
			console.log("DRAWDIAGRAM");
			if (tick === undefined) {
				diagram.drawYAxis(0);
				diagram.drawXAxis(0);
			} else {
				var maxY = 0;
				var minX = tick;
				$.each(that.nodeCount, function(key, value) {
					value.forEach(function(point) {
						if (point.x < minX) {
							minX = point.x;
						}
						if (point.y > maxY) {
							maxY = point.y;
						}
					});
				});
				diagram.drawYAxis(maxY);
				diagram.drawXAxis(minX, tick);
			}
			
			if (colors_for_nodes !== undefined) {
				svgdiagram.selectAll('.diagram_lines').remove();
				$.each(that.nodeCount, function(key, value){
				
				
					svgdiagram.append("svg:path")
					.attr("d", diagram.line(value))
					.attr("class", "diagram_lines")
					.attr("id", "line_" + key)
					.attr('stroke', colors_for_nodes[key].color)
					.attr('fill', 'none');
				});
			}
		}
		
		
		this.onRemoveDiagram = function() {
			that.showingDiagram = false;
			d3.select("#svgdiagram").remove();
		}
		
		this.ondrawMap = function() {
			console.log('this.ondrawMap');
			$.getJSON('/diagram/getsvgjson', {'tick': false}, function(data) {
				console.log(data);
				
				var svgmap = d3.select("#svgmap");

				svgmap.selectAll('#mapnode').remove();
				svgmap.selectAll('.map_collector').remove();
				svgmap.selectAll('#background').remove();
				svgmap.selectAll('.map_river').remove();
				svgmap.append('rect')
					  .attr('id', 'background')
				      .attr('x', -data.world_width/2)
				      .attr('y', -data.world_height/2)
				      .attr('width', data.world_width)
				      .attr('height', data.world_height)
				      .attr('fill', 'black')
				      .attr("transform", 
				    		  translate_map());
				draw_map(data.paths);
				console.log(data.river);
				console.log(data.colors_for_river);
				_.each(data.river, function(list,key) {
					var resource_name = data.resource_names[key];
					var river_paths = diagram.path_river(list);
					console.log(river_paths);
				    river_paths.forEach(function(river_path) {
				        var path_string = diagram.calc_bezier_path(river_path);
				        svgmap.append('path')
				                .attr('class', 'map_river')
				                .attr('d', path_string)
				                .attr('fill', 'none')
				                .attr('stroke', data.colors_for_river[key].border_color)
				                .attr('stroke-width', 6/0.025)
				                .attr('stroke-opacity', 1)
				                .attr("transform", 
				    		            translate_map());
				        svgmap.append('path')
				                .attr('class', 'map_river')
				                .attr('d', path_string)
				                .attr('fill', 'none')
				                .attr('stroke-width', 4/0.025)
				                .attr('stroke', data.colors_for_river[key].color)
				                .attr("transform", 
				    		            translate_map());
				    });

				});
				_.each(data.nodes, function(list,key) {
					var resource_name = data.resource_names[key];
					_.each(list, function(xy){
						svgmap.append("circle")
						   .attr("class", "node_" + key + ' map_node')
						   .attr('id', 'mapnode_' + key)
						   .attr("cx", xy[0])
					       .attr("cy", xy[1])
						   .attr("r", 3/0.025)
						   .attr("stroke-width", 1/0.025)
						   .attr('fill', data.colors_for_nodes[key].color)
						   .attr('stroke', data.colors_for_nodes[key].border_color)
						   .attr("transform", 
				    		  translate_map());
					});
					if (that.showingDiagram) {
						$.getJSON('/simulator/status', function(worldData) {
							console.log(worldData.worldStatus[0].tick);
							console.log("" + key + ":" + list.length);
							if (key in that.nodeCount) {
								if (that.nodeCount[key][that.nodeCount[key].length - 1].x !== worldData.worldStatus[0].tick) {
									that.nodeCount[key].push({y: list.length, x: worldData.worldStatus[0].tick});
								}
							} else {
								that.nodeCount[key] = [{y: list.length, x: worldData.worldStatus[0].tick}];
							}
							that.drawDiagram(data.colors_for_nodes, worldData.worldStatus[0].tick);
						}); 
						
					}
					$(".node_" + key).mouseover(function() {
						mouse.mouse_over_node(resource_name);
					});
				});


				
				
				var text = svgmap.selectAll('#show_node_name');
				var node_name = '';
				if (!text.empty()) {
					node_name = text.text();
				}
				svgmap.selectAll('#show_node_name').remove();
				var text_element = svgmap.append('text');
				text_element.text(node_name)
				      .attr('x', 10)
				      .attr('y', 20)
				      .attr('id', 'show_node_name')
				      .attr('font-weight', 'bold')
				      .attr('font-size', 24);
				var bb = text_element.node().getBBox();
				svgmap.selectAll('#show_node_name_box').remove();
				svgmap.insert(('rect'), '#show_node_name')
				.attr('x', bb.x - 4)
			    .attr('y', bb.y)
			    .attr('width', bb.width + 8)
			    .attr('height', bb.height)
			    .attr('fill', 'white')
			    .attr('fill-opacity', 0.5)
			    .attr('id', 'show_node_name_box');

				console.log(that.running);
				console.log(that);
				if (that.running) {
					fu.msg.drawMap.dispatch('true');
				}
				if (that.running) {
					diagram.runWorld();
				}
			});
			
		};
				
//		this.onInitiateConnection = function() {
//			var errors = currentConnectFormView.commit();
//			if(!errors) {
//				currentConnectForm.on('sync', function() {
//					fu.models['diagram'].onInitiateConnectionComplete();
//				});
//				currentConnectForm.save();	
//			}
//		}
//		
//		this.onInitiateConnectionComplete = function() {
//			currentConnectForm = null;
//			currentConnectFormView = null;
//			fu.closeModal();
//			$.getJSON("/diagram/getcss", 
//					function(data) {
//					$("#node_style").html(data.css);
//			});
//			fu.msg.drawMap.dispatch('false');
//			this.addSimulatorControl();
//		}
		
		this.addSimulatorControl = function() {
			var template = _.template($('#tpl-diagram-simulator-control-buttons').html());
			var steamRoller = $(template());
			$('#diagram-simulator-control-buttons').html(steamRoller);
		};
		
		this.onStartRunning = function() {
			that.running = true;
			diagram.runWorld();
		};
		
		this.onStopRunning = function() {
			that.running = false;
		};
		
		//SUBSCRIBE TO MESSAGES
		//fu.msg.drawMap.add(this.ondrawMap);
		//fu.msg.updateResourceFiltersComplete.add(this.ondrawMap);
		
		//Changed by Jonas - new signal name
		fu.msg.resourceFilterChanged.add(this.ondrawMap);
		
		fu.msg.runProcessComplete.add(this.ondrawMap);
		fu.msg.startRunning.add(this.onStartRunning);
		fu.msg.stopRunning.add(this.onStopRunning);
		fu.msg.showDiagram.add(this.onShowDiagram);
		fu.msg.removeDiagram.add(this.onRemoveDiagram);
		
		//Changed by Jonas - draw default from start
		this.ondrawMap();
	};
	
	
	return diagramModule;
})();
fu.models['diagram'] = new DiagramModule();
