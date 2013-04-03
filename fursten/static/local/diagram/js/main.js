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
	var diagramModule = function() {
		
		var currentConnectForm = null;
		var currentConnectFormView = null;
		this.running = false;
		var that = this;
		console.log(that);
		//MESSAGES
		fu.msg.drawMap = new signals.Signal();
		fu.msg.startRunning = new signals.Signal();
		fu.msg.stopRunning = new signals.Signal();
		
		this.ondrawMap = function(tick) {
			$.getJSON('/diagram/getsvgjson', {'tick': tick}, function(data) {
				console.log(data);
				draw_map(data.paths);
				var svgmap = d3.select("#svgmap");

				svgmap.selectAll('#mapnode').remove();
				_.each(data.nodes, function(list,key) {
					_.each(list, function(xy){
						svgmap.append("circle")
						   .attr("class", "node_" + key + ' map_node')
						   .attr('id', 'mapnode')
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

				svgmap.selectAll('#show_node_name').remove();
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

				console.log(that.running);
				console.log(that);
				if (that.running) {
					fu.msg.drawMap.dispatch('true');
				}
			});
			
		};
				
		this.onInitiateConnection = function() {
			var errors = currentConnectFormView.commit();
			if(!errors) {
				currentConnectForm.on('sync', function() {
					fu.models['diagram'].onInitiateConnectionComplete();
				});
				currentConnectForm.save();	
			}
		}
		
		this.onInitiateConnectionComplete = function() {
			currentConnectForm = null;
			currentConnectFormView = null;
			fu.closeModal();
			$.getJSON("/diagram/getcss", 
					function(data) {
					$("#node_style").html(data.css);
			});
			fu.msg.drawMap.dispatch('false');
			this.addSimulatorControl();
		}
		
		this.addSimulatorControl = function() {
			var template = _.template($('#tpl-diagram-simulator-control-buttons').html());
			var steamRoller = $(template());
			$('#diagram-simulator-control-buttons').html(steamRoller);
		};
		
		this.onStartRunning = function() {
			that.running = true;
			fu.msg.drawMap.dispatch('true');
		};
		
		this.onStopRunning = function() {
			that.running = false;
		};
		
		//SUBSCRIBE TO MESSAGES
		fu.msg.drawMap.add(this.ondrawMap);
		fu.msg.startRunning.add(this.onStartRunning);
		fu.msg.stopRunning.add(this.onStopRunning);
	};
	
	
	return diagramModule;
})();
fu.models['diagram'] = new DiagramModule();
