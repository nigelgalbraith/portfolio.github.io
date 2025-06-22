function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");
  
  const allFactors = Extract.getAllFactors(extracts);
  container.innerHTML = Factor.createAnalysisTable(allFactors);
}

window.onload = main;