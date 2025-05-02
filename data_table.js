// data_table.js
import { state } from './state.js';

let container;
let fullData = [];

export function initDataTable(data) {
  fullData = data;
  container = d3.select("#dataTable");
  updateDataTable();
}

export function updateDataTable() {
  const data = filterData(fullData);
  container.html("");

  const table = container.append("table")
    .style("width", "100%")
    .style("border-collapse", "collapse");

  const columns = ["date", "category", "product", "sales"];

  // Header
  const thead = table.append("thead");
  const headerRow = thead.append("tr");
  headerRow.selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(d => d)
    .style("border", "1px solid #ccc")
    .style("padding", "8px")
    .style("background-color", "#f2f2f2");

  // Body
  const tbody = table.append("tbody");
  const rows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr")
    .style("cursor", "pointer")
    .style("background-color", d => d.id === state.selectedRowId ? "#d2e3fc" : null)
    .on("click", (event, d) => {
      state.selectedRowId = (state.selectedRowId === d.id) ? null : d.id;
    });

  rows.selectAll("td")
    .data(d => columns.map(key => d[key]))
    .enter()
    .append("td")
    .text(d => d)
    .style("border", "1px solid #ccc")
    .style("padding", "6px");
}

function filterData(data) {
  let result = data;
  if (state.selectedTimeRange) {
    const [start, end] = state.selectedTimeRange;
    result = result.filter(d => d.date >= start && d.date <= end);
  }
  if (state.selectedCategory) {
    result = result.filter(d => d.category === state.selectedCategory);
  }
  return result;
}
