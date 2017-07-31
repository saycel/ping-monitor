/*
	Dropdown with Multiple checkbox select with jQuery - May 27, 2013
	(c) 2013 @ElmahdiMahmoud
	license: https://www.opensource.org/licenses/mit-license.php
*/

$(".dropdown dt a").on('click', function() {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function() {
  $(".dropdown dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});

$('.mutliSelect input[type="checkbox"]').on('click', function() {

  var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).val() + ",";

  if ($(this).is(':checked')) {
    var html = '<span title="' + title + '">' + title + '</span>';
    $('.multiSel').append(html);
    $(".hida").hide();
  } else {
    $('span[title="' + title + '"]').remove();
    var ret = $(".hida");
    $('.dropdown dt a').append(ret);

  }
});


/*
TODO OVERALL
- cleanup code
- comment where necessary
*/

// TODO - callback maybe?

window.setTimeout(begin, 2000);

var minAcceptableDelay = 1000;//millis

// Setting up variables for svg 
var 	svg = d3.select("svg"),
	margin = {top: 50, right: 200, bottom: svg.attr("height")*.25, left: 200},
	margin2 = {top: svg.attr("height")*.8, right: 200, bottom: svg.attr("height")*.15, left: 200},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var 	x = d3.scaleTime().range([0, width]),
	x2 = d3.scaleTime().range([0, width]),
	y = d3.scaleLinear().range([0,height]),
	y2 = d3.scaleLinear().rangeRound([0,height2]);

y.clamp(true);
y2.clamp(true);

var 	xAxis = d3.axisBottom(x),
	xAxis2 = d3.axisBottom(x2),
	yAxis = d3.axisLeft(y).ticks(10, "s");

// setting functions to make svg interactive (i.e. zoom, etc)
var brush = d3.brushX()
	.extent([[0, 0], [width, height2]])
	.on("brush end", brushed);

var zoom = d3.zoom()
	.scaleExtent([1, Infinity])
	.translateExtent([[0, 0], [width, height]])
	.extent([[0, 0], [width, height]])
	.on("zoom", zoomed);

// setting up line styles
//TODO check if the right type of curves are being used
var line = d3.line()
	.curve(d3.curveBasis)
	.x(function(d) { return x(parseTime(d.date)); })
	.y(function(d) { 
		if (d.ResponseTime != "" ){
			return y(parseInt(d.ResponseTime.replace('ms','')));
		}else{
			return y(minAcceptableDelay) 
		}
	});

//TODO - line and line2 seem to do exactly the same thing. may be redundant
var line2 = d3.line()
	.curve(d3.curveBasis)
	.x(function(d) { return x2(parseTime(d.date)); })
	.y(function(d) { 
		if (d.ResponseTime != "" ){
			return y2(parseInt(d.ResponseTime.replace('ms','')));
		}else{
			return y2(minAcceptableDelay)
		}
	});

// This prevents the line chart on the main visualization from extending beyond the scale when zoomed
svg.append("defs")
	.append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);

var focus = svg.append("g")
	.attr("class", "focus")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
	.attr("class", "context")
	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

//TODO - auto parse from user input

function createDataURLs(bsc, year, month, day){
	URLs = [];
	for(var i = 0; i < bsc.length; i++){
		URLs[i] = bsc[i]+'/query/'+year;
		console.log(month);
		if(month){ 
			URLs[i] += '/'+month;
			if(day){ 
				URLs[i] += '/'+day;
			};
		};

	}
	console.log(URLs);
	return URLs;
}

//TODO - better way of selecting colors
var colorScheme = ["blue","green","violet"];

var names = ["Bluefields Office", "Pearl Lagoon", "NYU Research"];

var theData = [];
var averagePingTime = [];

//parseDataFromURLs(createDataURLs(['bluefields','pearl-lagoon'], '2017', '07'));
//parseDataFromURLs(createDataURLs(['pearl-lagoon'], '2017', '07'));

// wtf? TODO
function parseDataFromURLs(theURLs){
	theURLs.forEach(function(d,i){
		d3.json(d, function(err, data){
			theData.push(data);	
			//TODO calculate average - maybe do this elsewhere	
		});
	});
}

function begin(){
	width = window.innerWidth;
	svg.attr("width", width);
	resetChart();
	setTimeout(function(){visualize(theData);},500);
}

function visualize(data){
	console.log("visualize fn running");
	console.log(data);
	var startTime = parseTime(data[0][0].date);
	var endTime = parseTime(data[0][data[0].length-1].date);
	for(i = 1; i < data.length; i++){
		if(startTime > parseTime(data[i][0].date)) startTime = parseTime(data[i][0].date);
		//console.log(data[i][data[i].length-1].date);
		if(endTime < parseTime(data[i][data[i].length-1].date)) endTime = parseTime(data[i][data[i].length-1].date);	
	}

	//console.log(startTime + " - " + endTime);
	x.domain([startTime, endTime]);
	y.domain([0,minAcceptableDelay]); 

	/*
	  x.domain(d3.extent(data[0], function(d) { 
	    return parseTime(d.date); 
	  }));
	  y.domain(d3.extent(data[0],function(d) { 
	    return parseInt(d.ResponseTime.replace('ms','')); 
	  }));
	*/

	x2.domain(x.domain());
	y2.domain(y.domain());

	// main vis
	focus.selectAll(".line")
		.data(data)
		.enter().append("path")
		.attr("d", line)
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", function(d,i){ return colorScheme[i]})
	 ;

	/*
	// vis of first data set 
	  focus.append("path")
	      .datum(data[0])
	      .attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", colorScheme[0])
	      .attr("d", line)
	;

	// vis of second data set
	  focus.append("path")
	      .datum(data[1])
	      .attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", colorScheme[1])
	      .attr("d", line)
	;
	*/

	//x-axis tickers and labels

	  focus.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + height + ")")
		.style("font-size", "1em")
	      .call(xAxis);


	//y-axis tickers and labels
	  focus.append("g")
	      .attr("class", "axis axis--y")	
		.style("font-size", "1em")
	      .call(yAxis);

	// paths within scrollbar
	context.selectAll(".line")
		.data(data)
		.enter().append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", function(d,i){ return colorScheme[i]})
		.attr("d", line2)
	;
	focus.append("g")
		.append("text")
		.attr("fill", "#000")
		.attr("x", -60)
		.attr("y", 6)
		.attr("text-anchor", "end")
		.style("font-size", "1.2em")
		.text("Fastest");

	focus.append("g")
		.append("text")
		.attr("fill", "#000")
		.attr("x", -60)
		.attr("y", height)
		.attr("text-anchor", "end")
		.style("font-size", "1.2em")
		.text("Slowest");

	focus.append("g")
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", -100)
		.attr("x", -height*.8/2)
		.attr("text-anchor", "end")
		.style("font-size", "1.5em")
		.text("Ping Time");

	//x-axis tickers and labels for scrollbar
	context.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height2 + ")")
		.style("font-size", "1em")
		.call(xAxis2);

	// scrollbar indicator
	context.append("g")
		.attr("class", "brush")
		.call(brush)
		.call(brush.move, x.range());

	// zoom function (you cannot scroll/zoom into the data without this)
	svg.append("rect")
		.attr("class", "zoom")
		.attr("width", width*2)
		.attr("height", height)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(zoom);
	}

function brushed() {
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
	var s = d3.event.selection || x2.range();
	x.domain(s.map(x2.invert, x2));
	focus.selectAll(".line").attr("d", line);
	focus.select(".axis--x").call(xAxis);
	/* TODO - this part allows the user to double click the scrollbar to expand range, but it's buggy
	svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
	.scale(width / (s[1] - s[0]))
	.translate(-s[0], 0));
	*/
}

function zoomed() {
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	focus.selectAll(".line").attr("d", line);
	focus.select(".axis--x").call(xAxis);
	context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
	d.date = parseTime(d.date);
	d.ResponseTime = +parseInt(d.ResponseTime.replace('ms',''));
	return d;
}
window.addEventListener('resize', resize); 

function resize() {
	var width = window.innerWidth, height = window.innerHeight;
	svg.attr("width", width).attr("height", height);
}

document.getElementById("submit").onclick = function(){
	resetChart();
//	window.location = window.location;
//	svg.selectAll("rect").remove();
	setTimeout(function(){visualize(theData);},500);
};

function resetChart(){
	var bscselect = [];
	if(document.getElementById("pearl-lagoon").checked) bscselect.push('pearl-lagoon');
	if(document.getElementById("bluefields").checked) bscselect.push('bluefields'); 
	if(document.getElementById("nyu").checked) bscselect.push('research');
	var year=document.getElementById("year").value; 
	var month=document.getElementById("month").value;
	var day=document.getElementById("day").value;
	theData=[];
	parseDataFromURLs(createDataURLs(bscselect, year, month, day));

	focus.remove();
	context.remove();
	
	focus = svg.append("g")
		.attr("class", "focus")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	context = svg.append("g")
		.attr("class", "context")
		.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
}
