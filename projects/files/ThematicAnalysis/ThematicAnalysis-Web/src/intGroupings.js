/**
 * Generate an HTML table showing each unique factor with its associated group and subgroup.
 * @param {Array} extracts - Array of Extract objects containing factors, groups, and subgroups.
 * @returns {string} - HTML string for the groupings table.
 */
function createGroupingsTable(extracts) {
  // Create a map to store each factor and its corresponding group/subgroup
  const factorMap = new Map();

  // Iterate through all extracts to populate the map
  extracts.forEach(extract => {
    extract.factors.forEach((factor, index) => {
      // Only add the factor if it's not already in the map
      if (!factorMap.has(factor.name)) {
        // Match the group and subgroup using the same index as the factor
        const group = extract.groups[index] || "";
        const subGroup = extract.subGroups[index] || "";

        factorMap.set(factor.name, {
          group: group,
          subGroup: subGroup
        });
      }
    });
  });

  // Sort the factor names alphabetically for consistent display
  const sortedFactors = Array.from(factorMap.keys()).sort();

  // Start building the HTML for the table
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

  // Populate the table rows with sorted factors and their mappings
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

  // Close the table tags
  html += `
      </tbody>
    </table>
  `;

  return html;
}

/**
 * Main function to generate and inject the groupings table into the page.
 */
function main() {
  try {
    // Load and prepare data from JSON using the controller
    const extracts = Controller.setup(jsonDataThematic);

    // Find the container where the groupings table will be inserted
    const container = document.getElementById("groupings-container");

    // Validate the container exists
    if (!container) {
      throw new Error("Groupings container element not found");
    }

    // Generate and insert the table into the container
    container.innerHTML = createGroupingsTable(extracts);

  } catch (error) {
    // Handle any setup or rendering errors
    console.error("Error loading groupings:", error);

    // Display a fallback error message in the container if it exists
    const container = document.getElementById("groupings-container");
    if (container) {
      container.innerHTML = `<div class="error">Error loading groupings: ${error.message}</div>`;
    }
  }
}

// Ensure `main()` runs once the DOM is fully loaded
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(main, 1);
} else {
  window.addEventListener("DOMContentLoaded", main);
}
