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
}

window.onload = main;