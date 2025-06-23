function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");
  
  const subGroupCounts = Extract.getSubGroupCounts(extracts);
  const subGroupsWithCounts = Object.entries(subGroupCounts).map(([name, count]) => {
    const subGroup = new SubGroup(name);
    subGroup.count = count;
    return subGroup;
  });
  
  container.innerHTML = SubGroup.createAnalysisTable(subGroupsWithCounts);
  
  // Pie chart for subgroups
  const chartData = Object.entries(subGroupCounts).map(([name, count]) => ({
    label: name,
    value: count
  }));
  
  container.innerHTML += `
    <div class="chart-container">
      <canvas id="subGroupChart"></canvas>
    </div>
  `;
  ChartVisualizer.createPieChart("subGroupChart", chartData, "Sub Group Distribution");
}

window.onload = main;