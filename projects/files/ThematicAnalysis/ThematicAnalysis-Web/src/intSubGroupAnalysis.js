function main() {
  // Initialize and process extracts from JSON data using the Controller
  const extracts = Controller.setup(jsonDataThematic);

  // Get reference to the container where results will be displayed
  const container = document.getElementById("analysis-container");

  // Get a count of all unique subgroups across all extracts
  const subGroupCounts = Extract.getSubGroupCounts(extracts);

  // Convert the count object into an array of SubGroup instances with count values
  const subGroupsWithCounts = Object.entries(subGroupCounts).map(([name, count]) => {
    const subGroup = new SubGroup(name);
    subGroup.count = count;
    return subGroup;
  });

  // Generate and display an HTML table summarizing subgroup counts
  container.innerHTML = SubGroup.createAnalysisTable(subGroupsWithCounts);

  // Prepare data for pie chart visualization
  const chartData = Object.entries(subGroupCounts).map(([name, count]) => ({
    label: name,
    value: count
  }));

  // Append a canvas element and render the subgroup distribution pie chart
  container.innerHTML += `
    <div class="chart-container">
      <canvas id="subGroupChart"></canvas>
    </div>
  `;
  ChartVisualizer.createPieChart("subGroupChart", chartData, "Sub Group Distribution");
}

// Run the main function when the window has fully loaded
window.onload = main;
