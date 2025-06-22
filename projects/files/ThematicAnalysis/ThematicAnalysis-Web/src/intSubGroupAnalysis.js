function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");
  
  const allSubGroups = Extract.getAllSubGroups(extracts);
  container.innerHTML = SubGroup.createAnalysisTable(allSubGroups);
}

window.onload = main;