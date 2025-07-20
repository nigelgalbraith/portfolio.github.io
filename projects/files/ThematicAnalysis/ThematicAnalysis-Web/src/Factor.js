class Factor {
  constructor(name) {
    // The name of the factor (e.g., "Training", "Communication")
    this.name = name;

    // Array of associated Group instances
    this.groups = [];
  }

  // Find a group by name within this factor
  findGroup(name) {
    return this.groups.find(g => g.name === name);
  }

  // Add a group to the factor if it doesn't already exist
  addGroup(group) {
    if (!this.findGroup(group.name)) {
      this.groups.push(group);
    }
    return this; // Enable method chaining
  }

  // Static method to generate an HTML summary table from an array of Factor instances
  static createAnalysisTable(factors) {
    const counts = {}; // Store counts per factor name
    let total = 0;      // Total number of factors

    // Count each factor by name
    factors.forEach(f => {
      const name = f.name;
      if (!counts[name]) counts[name] = 0;
      counts[name]++;
      total++;
    });

    // Sort factors by descending count
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    // Begin HTML table
    let html = `
      <table>
        <thead>
          <tr>
            <th>Factor</th>
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

  // String representation for debugging or logging
  toString() {
    return `Factor: ${this.name}`;
  }
}
