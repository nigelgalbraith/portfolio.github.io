function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");
  
  const allFactors = Extract.getAllFactors(extracts);
  container.innerHTML = Factor.createAnalysisTable(allFactors);
  
  // Pie chart for factors
  const factorCounts = {};
  allFactors.forEach(f => {
    factorCounts[f.name] = (factorCounts[f.name] || 0) + 1;
  });
  
  const chartData = Object.entries(factorCounts).map(([name, count]) => ({
    label: name,
    value: count
  }));
  
  container.innerHTML += `
    <div class="chart-container">
      <canvas id="factorChart"></canvas>
    </div>
  `;
  ChartVisualizer.createPieChart("factorChart", chartData, "Factor Distribution");
}

window.onload = main;