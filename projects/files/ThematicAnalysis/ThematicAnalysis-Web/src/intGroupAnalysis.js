function main() {
  // Step 1: Load and prepare extract data from JSON using the Controller
  const extracts = Controller.setup(jsonDataThematic);

  // Step 2: Get reference to the container where analysis will be displayed
  const container = document.getElementById("analysis-container");

  // Step 3: Get group counts from all extracts (how many times each group appears)
  const groupCounts = Extract.getGroupCounts(extracts);

  // Step 4: Convert group count entries into Group objects with a count property
  const groupsWithCounts = Object.entries(groupCounts).map(([name, count]) => {
    const group = new Group(name);
    group.count = count;
    return group;
  });

  // Step 5: Generate and inject HTML analysis table into the container
  container.innerHTML = Group.createAnalysisTable(groupsWithCounts);

  // Step 6: Prepare chart data (labels and values) for each group
  const chartData = Object.entries(groupCounts).map(([name, count]) => ({
    label: name,
    value: count
  }));

  // Step 7: Add a canvas element to host the pie chart
  container.innerHTML += `
    <div class="chart-container">
      <canvas id="groupChart"></canvas>
    </div>
  `;

  // Step 8: Render the pie chart showing group distribution
  ChartVisualizer.createPieChart("groupChart", chartData, "Group Distribution");
}

// Run the main function once the page has fully loaded
window.onload = main;
