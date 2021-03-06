generate_sankey = function(data){

  var threshold = 0;
  var ordering = 'custom';
  // var ordering = 'default';

  sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(32, ordering);

  var link = svg.append("g").selectAll(".link")
      .data(data.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .style("visibility", function(d) {
        if (d.value >= threshold) {
          return 'visible';
        } else {
          return 'hidden';
        }
      })
      .sort(function(a, b) { return b.dy - a.dy; });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  var node = svg.append("g").selectAll(".node")
      .data(data.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

  visible_label_map = {};
  for (var i = 0; i < node.data().length; i++) {
    visible_label_map[node.data()[i].name] = i;
  }

  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });

  node.append("text")
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start")
      .attr("transform", null)
      .style('font-family', '"Georgia", Georgia, serif')
      .text(function(d) {
        if (data.nodes.indexOf(d) === visible_label_map[d.name]) {
          return d.name;
        }
      });

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
};