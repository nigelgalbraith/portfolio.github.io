function main() {
  // Step 1: Load and prepare thematic extracts using Controller
  const extracts = Controller.setup(jsonDataThematic);

  // Step 2: Get the container where analysis will be inserted
  const container = document.getElementById("analysis-container");

  // Step 3: Extract all factors from the loaded extracts
  const allFactors = Extract.getAllFactors(extracts);

  // Step 4: Generate and insert the HTML table summarizing factors
  container.innerHTML = Factor.createAnalysisTable(allFactors);

  // Step 5: Prepare data for the pie chart (count how often each factor appears)
  const factorCounts = {};
  allFactors.forEach(f => {
    factorCounts[f.name] = (factorCounts[f.name] || 0) + 1;
  });

  // Step 6: Transform counts into chart-ready format
  const chartData = Object.entries(factorCounts).map(([name, count]) => ({
    label: name,
    value: count
  }));

  // Step 7: Add a canvas element to the container for the pie chart
  container.innerHTML += `
    <div class="chart-container">
      <canvas id="factorChart"></canvas>
    </div>
  `;

  // Step 8: Render the pie chart showing factor distribution
  ChartVisualizer.createPieChart("factorChart", chartData, "Factor Distribution");
}

// Initialize everything once the window finishes loading
window.onload = main;
