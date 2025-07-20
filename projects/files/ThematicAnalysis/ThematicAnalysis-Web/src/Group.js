class Group {
  constructor(name) {
    // Name of the group (e.g., "Communication", "Process")
    this.name = name;

    // List of associated SubGroup instances
    this.subGroups = [];
  }

  // Find a specific SubGroup by name
  findSubGroup(name) {
    return this.subGroups.find(sg => sg.name === name);
  }

  // Add a new SubGroup if it's not already present
  addSubGroup(subGroup) {
    if (!this.findSubGroup(subGroup.name)) {
      this.subGroups.push(subGroup);
    }
    return this; // Enables method chaining
  }

  // Static method to generate an analysis table for an array of group objects
  // Each group must have a 'name' and 'count' property (pre-counted externally)
  static createAnalysisTable(groups) {
    const counts = {};
    let total = 0;

    // Build a dictionary of group name → count
    groups.forEach(group => {
      counts[group.name] = group.count;
      total += group.count;
    });

    // Sort groups by count in descending order
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    // Build the HTML table
    let html = `
      <table class="group-analysis">
        <thead>
          <tr>
            <th>Group</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Add each row to the table
    sorted.forEach(([name, count]) => {
      const percent = ((count / total) * 100).toFixed(1);
      html += `
        <tr>
          <td>${name}</td>
          <td>${count}</td>
          <td>${percent}%</td>
        </tr>
      `;
    });

    html += '</tbody></table>'; // Close table
    return html;
  }

  // Return the name of the group as its string representation
  toString() {
    return this.name;
  }
}
