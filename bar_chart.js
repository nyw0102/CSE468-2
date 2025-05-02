// bar_chart.js
import { state } from './state.js';

let svg, x, y, color, width = 800, height = 300;
let fullData = [];

export function initBarChart(data) {
  fullData = data;

  svg = d3.select("#barChartSVG")
    .attr("viewBox", `0 0 ${width} ${height}`);

  x = d3.scaleBand().padding(0.1).range([0, width]);
  y = d3.scaleLinear().range([height, 0]);
  color = d3.scaleOrdinal(d3.schemeSet2);

  updateBarChart();
}

export function updateBarChart() {
  const data = aggregateByCategory(filterByTime(fullData));

  x.domain(data.map(d => d.category));
  y.domain([0, d3.max(data, d => d.sales)]);

  const bars = svg.selectAll("rect").data(data, d => d.category);

  bars.enter()
    .append("rect")
    .attr("x", d => x(d.category))
    .attr("width", x.bandwidth())
    .attr("y", height)
    .attr("height", 0)
    .attr("fill", d => color(d.category))
    .on("click", (event, d) => {
      state.selectedCategory = (state.selectedCategory === d.category) ? null : d.category;
    })
    .merge(bars)
    .transition()
    .duration(500)
    .attr("x", d => x(d.category))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.sales))
    .attr("height", d => height - y(d.sales))
    .attr("fill", d => color(d.category))
    .attr("opacity", d => state.selectedCategory && state.selectedCategory !== d.category ? 0.5 : 1);

  bars.exit().remove();

  svg.selectAll(".x-axis").data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.selectAll(".y-axis").data([null])
    .join("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));
}

function filterByTime(data) {
  if (!state.selectedTimeRange) return data;
  const [start, end] = state.selectedTimeRange;
  return data.filter(d => d.date >= start && d.date <= end);
}

function aggregateByCategory(data) {
  const grouped = d3.rollup(data, v => d3.sum(v, d => d.sales), d => d.category);
  return Array.from(grouped, ([category, sales]) => ({ category, sales }));
}
