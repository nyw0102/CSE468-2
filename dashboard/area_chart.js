
import { state } from './state.js';

let svg, x, y, xAxis, area, brush, xContext, yContext, areaContext;
let focus, context;
let fullData = [];

export function initAreaChart(data) {
  fullData = data;

  const margin = { top: 20, right: 20, bottom: 110, left: 40 },
        margin2 = { top: 230, right: 20, bottom: 30, left: 40 },
        width = 800,
        height = 270,
        height2 = 70;

  svg = d3.select("#areaChartSVG")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

  x = d3.scaleTime().range([0, width]);
  y = d3.scaleLinear().range([height, 0]);
  xContext = d3.scaleTime().range([0, width]);
  yContext = d3.scaleLinear().range([height2, 0]);

  xAxis = d3.axisBottom(x);

  area = d3.area()
    .x(d => x(d.date))
    .y0(height)
    .y1(d => y(d.sales));

  areaContext = d3.area()
    .x(d => xContext(d.date))
    .y0(height2)
    .y1(d => yContext(d.sales));

  brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

  focus = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  context = svg.append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

  updateAreaChart();
}

export function updateAreaChart() {
  const data = filterByCategory(fullData);

  x.domain(d3.extent(data, d => d.date));
  y.domain([0, d3.max(data, d => d.sales)]);
  xContext.domain(x.domain());
  yContext.domain(y.domain());

  focus.selectAll(".area-main").remove();
  focus.selectAll(".x-axis").remove();

  focus.append("path")
    .datum(data)
    .attr("class", "area-main")
    .attr("fill", "#8B4513")
    .attr("d", area);

  focus.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${y.range()[0]})`)
    .call(xAxis);

  context.selectAll(".area-context").remove();
  context.selectAll(".x-axis-context").remove();
  context.selectAll(".brush").remove();

  context.append("path")
    .datum(data)
    .attr("class", "area-context")
    .attr("fill", "#A0522D")
    .attr("d", areaContext);

  context.append("g")
    .attr("class", "x-axis-context")
    .attr("transform", `translate(0,${yContext.range()[0]})`)
    .call(d3.axisBottom(xContext));

  context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());
}

function brushed({ selection }) {
  if (!selection) return;
  const [x0, x1] = selection.map(xContext.invert);
  state.selectedTimeRange = [x0, x1];
}

function filterByCategory(data) {
  if (!state.selectedCategory) return data;
  return data.filter(d => d.category === state.selectedCategory);
}
