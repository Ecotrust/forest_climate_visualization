var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 1200 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " acres"; },
    color = d3.scale.category20();

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width-200, height]);

var path = sankey.link();