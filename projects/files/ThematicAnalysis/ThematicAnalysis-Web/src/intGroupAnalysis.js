function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");
  
  const allGroups = Extract.getAllGroups(extracts);
  container.innerHTML = Group.createAnalysisTable(allGroups);
}

window.onload = main;