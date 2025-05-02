// main.js
import { initAreaChart, updateAreaChart } from './area_chart.js';
import { initBarChart, updateBarChart } from './bar_chart.js';
import { initDataTable, updateDataTable } from './data_table.js';
import { resetState, updateAllComponents } from './state.js';

let rawData = [];

// 날짜 파싱 함수 (e.g., "04-Jan-22")
const parseDate = d3.timeParse("%d-%b-%y");

// 데이터 불러오기 및 초기화
(async function () {
  rawData = await d3.csv("chocolate_sales_cleaned.csv", d => ({
    date: parseDate(d.Date),                             // "04-Jan-22" 형식 파싱
    sales: +d.Amount.replace(/[$,]/g, ""),              // "$5,320" → 5320 숫자로 변환
    category: d.Country,
    product: d.Product,
    salesperson: d["Sales Person"],
    boxes: +d["Boxes Shipped"],
    id: d["Sales Person"] + "_" + d.Date
  }));

  console.log("Parsed Data:", rawData.slice(0, 5));

  initAreaChart(rawData);
  initBarChart(rawData);
  initDataTable(rawData);

  d3.select("#reset-btn").on("click", () => {
    resetState();
    updateAllComponents(updateFns);
  });
})();

const updateFns = {
  areaChart: updateAreaChart,
  barChart: updateBarChart,
  dataTable: updateDataTable
};

export { updateFns };
