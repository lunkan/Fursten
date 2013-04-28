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

