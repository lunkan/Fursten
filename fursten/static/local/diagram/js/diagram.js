var diagram = {}

diagram.HEIGHT = 450;
diagram.PADDING = 50;
diagram.WIDTH = 450;

diagram.xScale = null;
diagram.yScale = null;

diagram.drawYAxis = function(maxY) {
	var svgdiagram = d3.select("#svgdiagram");
	yScale = d3.scale.linear()
	.domain([0, maxY + 10])
	.range([diagram.HEIGHT, diagram.PADDING]);
	
	d3.select("#yaxis").remove();
	yAxis = d3.svg.axis()
	   .scale(yScale)
	   .orient("left");
	
	   svgdiagram.append("g")
	   .attr("id", "yaxis")
	   .attr("class", "axis")
	   .attr('stroke', 'white')
	   .attr("transform", "translate(" + diagram.PADDING + ", 0)")
	   .call(yAxis);
}

diagram.drawXAxis = function(minX, maxX) {
	var svgdiagram = d3.select("#svgdiagram");
	xScale = d3.scale.linear()
	.domain([maxX + 10, minX])
	.range([diagram.WIDTH, diagram.PADDING]);
	
	d3.select("#xaxis").remove();
	xAxis = d3.svg.axis()
	   .scale(xScale)
	   .orient("bottom");
	
	   svgdiagram.append("g")
	   .attr("id", "xaxis")
	   .attr("class", "axis")
	   .attr('stroke', 'white')
	   .attr("transform", "translate(" + 0 + ", " + (diagram.HEIGHT) + ")")
	   .call(xAxis);
}

diagram.line = d3.svg.line()
	.x(function(d, n) { 
		return xScale(d.x); 
	})
	.y(function(d, n) { 
		return yScale(d.y);
	});

diagram.runWorld = function() {
	$.ajax({
		url: '/world/run/',
		type: 'POST',
		success: function() {
			fu.msg.runProcessComplete.dispatch();
		},
		error: function() {
			alert('run error');
		}
    });	
}

diagram.path_river = function(nodes_in) {
    var nodes = nodes_in.slice();
    var akuten = 0;
    
    var current_node = nodes[0];
    var proto_paths = [[[current_node[0], current_node[1]]]];
    var mode = "FIRST_STEP";
    nodes.splice(0,1);
    while(akuten < 10000 && nodes.length > 0) {
        akuten++;
        var min_dist = false;
        var min_dist_n = false;
        nodes.forEach(function(other_node, n) {
            var current_dist = Math.sqrt((current_node[0] - other_node[0])*(current_node[0] - other_node[0]) + (current_node[1] - other_node[1])*(current_node[1] - other_node[1]));
            if (current_dist < 1000) {
                if (min_dist === false || current_dist < min_dist) {
                    min_dist = current_dist;
                    min_dist_n = n;
                }
            }
        });
        if (min_dist !== false) {
            if (mode === "FIRST_STEP") {
                //proto_paths[proto_paths.length - 1].push({x: current_node[0], y: current_node[1]});
                proto_paths[proto_paths.length - 1].push([nodes[min_dist_n][0], nodes[min_dist_n][1]]);
            } else {
                //proto_paths[proto_paths.length - 1].splice(0, 0, {x: current_node[0], y: current_node[1]});
                proto_paths[proto_paths.length - 1].splice(0, 0, [nodes[min_dist_n][0], nodes[min_dist_n][1]]);
            }
            current_node = nodes[min_dist_n];
            nodes.splice(min_dist_n,1);
        } else {
            console.log(proto_paths[proto_paths.length - 1].length);
            if (proto_paths[proto_paths.length - 1].length === 0) {
                proto_paths[proto_paths.length - 1].push([current_node[0], current_node[1]]);
            }
            if (mode === "FIRST_STEP") {
                current_node = proto_paths[proto_paths.length - 1][0];
                mode = "SECOND_STEP";
            } else {
                current_node = nodes[0];
                nodes.splice(0,1);
                proto_paths.push([[current_node[0], current_node[1]]]);
                mode = "FIRST_STEP";
            }
        }
    }
    console.log(proto_paths);
    proto_paths = proto_paths.filter(function(path) {
        return path.length > 0;
    });
    
    proto_paths.forEach(function(current_path) {
        var start_node = current_path[0];
        var end_node = current_path[current_path.length - 1];
        var start_min_dist = false;
        var start_min_dist_node = false;
        var end_min_dist = false;
        var end_min_dist_node = false;
        proto_paths.forEach(function(other_path) {
            if (current_path !== other_path) {
                other_path.forEach(function(other_node) {
                    var start_current_dist = Math.sqrt((start_node[0] - other_node[0])*(start_node[0] - other_node[0]) + (start_node[1] - other_node[1])*(start_node[1] - other_node[1]));
                    var end_current_dist = Math.sqrt((end_node[0] - other_node[0])*(end_node[0] - other_node[0]) + (end_node[1] - other_node[1])*(end_node[1] - other_node[1]));
                    if (start_current_dist < 100) {
                        if (start_min_dist === false || start_current_dist < start_min_dist) {
                            start_min_dist = start_current_dist;
                            start_min_dist_node = other_node;
                        }
                    } else if (end_current_dist < 100) {
                        if (end_min_dist === false || end_current_dist < end_min_dist) {
                            end_min_dist = end_current_dist;
                            end_min_dist_node = other_node;
                        }
                    }
                });
            }    
        });
            
        if (start_min_dist !== false) {
            current_path.splice(0,0, [start_min_dist_node[0], start_min_dist_node[1]])
        }
        if (end_min_dist !== false) {
            current_path.push([end_min_dist_node[0], end_min_dist_node[1]])
        }
    });
    
    
    proto_paths = proto_paths.filter(function(path) {
        return path.length > 1;
    });
    
    return proto_paths;
}


diagram.calc_bezier_path = function(river_path) {
    var start = true;
    var path_string = "M ";
    var debug_string = "M ";
    river_path.forEach(function(p, n) {
        /*svgmap.append('circle')
            .attr('class', 'map_river')
            .attr('cx', p[0])
            .attr('cy', p[1])
            .attr('r', 5)
            .attr('fill', 'red')
            .attr('stroke', 'purple')
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 1);*/
    	console.log(p);
        if (start) {
            path_string += p[0] + " " + p[1];
            debug_string += p[0] + " " + p[1];
            start = false;
        } else  {
            if (n === 1) {
                var x1 = river_path[n - 1][0];
                var y1 = river_path[n - 1][1];
            } else {
                var x1 = river_path[n - 2][0];
                var y1 = river_path[n - 2][1];
            }
            if (n === river_path.length - 1) {
                var x4 = river_path[n][0];
                var y4 = river_path[n][1];
            } else {
                var x4 = river_path[n + 1][0];
                var y4 = river_path[n + 1][1];
            }
            var x2 = river_path[n - 1][0];
            var x3 = river_path[n][0];
            
            
            var y2 = river_path[n - 1][1];
            var y3 = river_path[n][1];
            
            var l0 = Math.sqrt((x3 - x1)*(x3 - x1) + (y3 - y1)*(y3 - y1));
            var l1 = Math.sqrt((x4 - x2)*(x4 - x2) + (y4 - y2)*(y4 - y2));
            var dx0 = (x3 - x1)/l0;
            var dy0 = (y3 - y1)/l0;
            var dx1 = (x4 - x2)/l1;
            var dy1 = (y4 - y2)/l1;
            var l = Math.sqrt((x3 - x2)*(x3 - x2) + (y3 - y2)*(y3 - y2));
            
            var px1 = x2 + dx0*l/2;
            var py1 = y2 + dy0*l/2;
            var px2 = x3 - dx1*l/2;
            var py2 = y3 - dy1*l/2;                    
            
            /*svgmap.append('circle')
                .attr('class', 'map_river')
                .attr('cx', px1)
                .attr('cy', py1)
                .attr('r', 5)
                .attr('fill', 'orange')
                .attr('stroke', 'purple')
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 1);
            svgmap.append('circle')
                .attr('class', 'map_river')
                .attr('cx', px2)
                .attr('cy', py2)
                .attr('r', 5)
                .attr('fill', 'green')
                .attr('stroke', 'purple')
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 1);                    
            */
            
            path_string += " C " + px1 + " " + py1 + " " + px2 + " " + py2 + " "+ x3 + " " + y3;
        
            debug_string += " L " + p[0] + " " + p[1];
        }
    });
    return path_string;
}