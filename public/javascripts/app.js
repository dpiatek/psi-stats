/*global data, meta*/

"use strict";

var d3 = require("d3");
require("d3-tip")(d3);

var chartConfig = require("./chart-config");

function formatDates(dates) {
  var result = [];

  for (var i = 0; i < dates.length; i++) {
    result.push(new Date(dates[i]));
  }

  return result;
}

function formatNumber(number) {
  var n = parseInt(number);
  return isNaN(n) ? 0 : n;
}

function createChart(data, dates, config) {
  var margin = {top: 80, right: 80, bottom: 80, left: 80},
      width = (window.innerWidth * 0.95) - margin.left - margin.right,
      height = 260 - margin.top - margin.bottom;

  var formatSI = d3.format("s");
  var formatInteger = d3.format("d");
  var format;

  switch (config.format) {
    case "integer":
      format = formatInteger;
      break;
    case "SI":
      format = formatSI;
      break;
  }

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) { return d.val.toFixed(); })
    .direction("nw")
    .offset([-3, 3]);

  var x = d3.scale.ordinal()
    .rangePoints([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickPadding(10)
    .tickFormat(d3.time.format("%d/%m %H:%M"));

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(4)
    .tickFormat(format);

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.val); });

  var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.val); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(tip);

  x.domain(dates);
  y.domain([0, d3.max(data, function(d) { return d.val ;}) * 1.25]);

  svg.append("text")
    .attr("class", "title")
    .attr("transform", "translate(0," + -20 + ")")
    .text(config.label);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-45)"
    });

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

  svg.selectAll("dot")
    .data(data)
  .enter().append("circle")
    .attr("class", "circle")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.val); })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);
}

function createCharts(data, dates, config) {
  for (var key in data) {
    var chartData = [];

    for (var i = 0; i < data[key].length; i++) {
      chartData.push({ val: formatNumber(data[key][i]), date: dates[i] });
    }

    createChart(chartData, dates, config[key]);
  }
}

createCharts(data, formatDates(meta.dates), chartConfig);
