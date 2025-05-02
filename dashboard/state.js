
export const state = {
  selectedTimeRange: null,    
  selectedCategory: null,     
  selectedRowId: null         
};


export function resetState() {
  state.selectedTimeRange = null;
  state.selectedCategory = null;
  state.selectedRowId = null;
}


export function updateAllComponents(updateFns) {
  updateFns.areaChart();
  updateFns.barChart();
  updateFns.dataTable();
}
