var parseDate = d3.time.format("%d/%m %H:%M")

var chartData = []
var dates = []
var _date;

for (var i = 0; i < data["numberResources"].length; i++) {
  _date = parseDate(new Date(meta.dates[i]))
  dates.push(_date)
  chartData.push({ val: data["numberResources"][i], date: _date })
}

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 260 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    // .ticks('20', 'K')

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log(dates)

// d3.tsv("data.tsv", type, function(error, data) {
  x.domain(dates);
  y.domain([0, d3.max(data["numberResources"])]);

  console.log(x.domain())

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
    //   .attr("y", 6)
    //   .attr("dy", ".71em")
    //   .style("text-anchor", "end")
    //   .text("Bytes");

  svg.selectAll(".bar")
      .data(chartData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.val) })
      .attr("height", function(d) { return height - y(d.val); });

// });

function type(d) {
  d.frequency = +d.frequency;
  return d;
}
