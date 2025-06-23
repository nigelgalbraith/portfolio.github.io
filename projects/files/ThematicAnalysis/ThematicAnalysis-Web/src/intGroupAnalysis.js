function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");
  
  const groupCounts = Extract.getGroupCounts(extracts);
  const groupsWithCounts = Object.entries(groupCounts).map(([name, count]) => {
    const group = new Group(name);
    group.count = count;
    return group;
  });
  
  container.innerHTML = Group.createAnalysisTable(groupsWithCounts);
  
  // Pie chart for groups
  const chartData = Object.entries(groupCounts).map(([name, count]) => ({
    label: name,
    value: count
  }));
  
  container.innerHTML += `
    <div class="chart-container">
      <canvas id="groupChart"></canvas>
    </div>
  `;
  ChartVisualizer.createPieChart("groupChart", chartData, "Group Distribution");
}

window.onload = main;