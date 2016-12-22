var
  margin = {top: 20, right: 20, bottom: 110, left: 40},
  margin2 = {top: 430, right: 20, bottom: 30, left: 40},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  height2 = 500 - margin2.top - margin2.bottom;

var svg = d3.select("#stackedBarChart")
  .append("svg")
  .attr('version', '1.1')
  .attr('viewBox', '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom))
  .attr('width', '100%');
  g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

var div = d3.select("#stackedBarChart").append("div")
  .attr("class", "tooltip")
  .style("opacity", 1);

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.3)
    .align(0.3);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal(["#1BC0A2", "#C01B5A"]);

var stack = d3.stack();

d3.csv("frequencia.csv", type, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.letra; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(data.columns.slice(1));

  g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.letra); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .on("mouseover", function(d) {
        var frequencia = d[0] == 0 ? ('aleatória:</label> <span>' + d.data.frequencia) : ('pt-br:</label> <span>'  + d.data.pt);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(
          '<label>Frequência '+ frequencia +'%</span>'
        )     
          .style("left", (d3.event.pageX - 2 * margin.left) + "px")             
          .style("top", (d3.event.pageY) + "px");
      });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .style("font", "14px sans-serif")
      .call(d3.axisBottom(x))

  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.bottom - 55) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#000")
      .text("Letra");

  g.append("g")
      .attr("class", "axis axis--y")
      .style("font", "14px sans-serif")
      .call(d3.axisLeft(y).ticks(10, "s"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("font-size", "14px")
      .attr("dy", "0.01em")
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .text("Frequência relativa");
 
  var legend = g.selectAll(".legend")
    .data(["Textos Aleatórios", "Língua Portuguesa"])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-" + margin.right * 10 + ", " + i * 20 + ")"; })
      .style("font", "10px sans-serif");

  legend.append("rect")
      .attr("x", width + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });
});

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}