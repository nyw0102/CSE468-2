// main.js
import { initAreaChart, updateAreaChart } from './area_chart.js';
import { initBarChart, updateBarChart } from './bar_chart.js';
import { initDataTable, updateDataTable } from './data_table.js';
import { resetState, updateAllComponents } from './state.js';

let rawData = [];

// 데이터 불러오기 및 초기화
(async function () {
  rawData = await d3.csv("chocolate_sales_cleaned.csv", d => ({
  date: new Date(d.Date),
  sales: +d.Amount,
  category: d.Country,
  product: d.Product,
  id: d["Sales Person"] + "_" + d.Date // 고유 ID 생성
}));

  // 컴포넌트 초기화
  initAreaChart(rawData);
  initBarChart(rawData);
  initDataTable(rawData);

  // 리셋 버튼 이벤트
  d3.select("#reset-btn").on("click", () => {
    resetState();
    updateAllComponents(updateFns);
  });
})();

// 각 컴포넌트 업데이트 함수들 모음
const updateFns = {
  areaChart: updateAreaChart,
  barChart: updateBarChart,
  dataTable: updateDataTable
};

// 외부에서 호출할 수 있도록 export (선택)
export { updateFns };
