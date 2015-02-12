var containers = document.querySelectorAll('.container');
var chartTitles = {
  "numberResources": "Number of resources",
  "numberHosts": "Number of hosts",
  "totalRequestBytes": "Total request bytes",
  "numberStaticResources": "Number of static resources",
  "htmlResponseBytes": "HTML response bytes",
  "cssResponseBytes": "CSS response bytes",
  "imageResponseBytes": "Image response bytes",
  "javascriptResponseBytes": "Javascript response bytes",
  "otherResponseBytes": "Other response bytes",
  "numberJsResources": "Number of javascript resources",
  "numberCssResources": "Number of css resources"
}

for (var i = 0; i < containers.length; i++) {
  createChart(containers[i]);
  createTitle(containers[i], chartTitles);
}

function createChart(container) {
  var key = container.dataset.statKey;
  var ctx = container.getContext("2d");
  var dates = formatDate(meta.dates);

  var chartData = {
    labels: dates,
    datasets: [
      {
        label: key,
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.5)",
        highlightFill: "rgba(220,220,220,0.5)",
        highlightStroke: "rgba(220,220,220,0.5)",
        data: data[key],
        formatData: formatData
      }
    ]
  }

  new Chart(ctx).Bar(chartData, { scaleLabel: "<%=this.formatData(value)%>" });
}

function createTitle(container, chartTitles) {
  var key = container.dataset.statKey;
  var title = document.createElement("h2");

  title.textContent = chartTitles[key];
  container.parentNode.insertBefore(title, container);
}

function formatData(data) {
  var result = "", fraction, integer;

  fraction = data.slice(3);

  if (fraction !== "") {
    integer = data.slice(0, 3);
    result = integer + "," + fraction;
  } else {
    result = data
  }

  return result;
}

function formatDate(dates) {
  var result = [], date;

  for (var i = 0; i < dates.length; i++) {
    date = new Date(dates[i]);
    result.push(
      date.getDate() + "/" + (date.getMonth() + 1) + " " +
      date.getHours() + ":" + date.getMinutes()
    );
  }

  return result;
}
