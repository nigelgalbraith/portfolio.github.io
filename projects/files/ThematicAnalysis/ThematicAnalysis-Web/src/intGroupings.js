function createGroupingsTable(extracts) {
  // Create a map of factors to their groups and subgroups
  const factorMap = new Map();

  extracts.forEach(extract => {
    extract.factors.forEach((factor, index) => {
      if (!factorMap.has(factor.name)) {
        // Get matching group and subgroup by index
        const group = extract.groups[index] || "";
        const subGroup = extract.subGroups[index] || "";
        
        factorMap.set(factor.name, {
          group: group,
          subGroup: subGroup
        });
      }
    });
  });

  // Sort factors alphabetically
  const sortedFactors = Array.from(factorMap.keys()).sort();

  let html = `
    <table class="groupings-table">
      <thead>
        <tr>
          <th>Factor</th>
          <th>Group</th>
          <th>Sub Group</th>
        </tr>
      </thead>
      <tbody>
  `;

  sortedFactors.forEach(factorName => {
    const { group, subGroup } = factorMap.get(factorName);
    html += `
      <tr>
        <td>${factorName}</td>
        <td>${group}</td>
        <td>${subGroup}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;
  return html;
}

function main() {
  try {
    const extracts = Controller.setup(jsonDataThematic);
    const container = document.getElementById("groupings-container");
    
    if (!container) {
      throw new Error("Groupings container element not found");
    }
    
    container.innerHTML = createGroupingsTable(extracts);
    
  } catch (error) {
    console.error("Error loading groupings:", error);
    const container = document.getElementById("groupings-container");
    if (container) {
      container.innerHTML = `<div class="error">Error loading groupings: ${error.message}</div>`;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(main, 1);
} else {
  window.addEventListener("DOMContentLoaded", main);
}