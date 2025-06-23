function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");
  
  // Get raw group counts (already counts occurrences)
  const groupCounts = Extract.getGroupCounts(extracts);
  
  // Convert to array of Group objects with proper counts
  const groupsWithCounts = Object.entries(groupCounts).map(([name, count]) => {
    const group = new Group(name);
    group.count = count; // Add count property to each group
    return group;
  });
  
  container.innerHTML = Group.createAnalysisTable(groupsWithCounts);
}

window.onload = main;