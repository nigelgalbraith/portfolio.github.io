/**
 * Represents a SubGroup used in thematic analysis or risk categorization.
 */
class SubGroup {
  /**
   * Create a SubGroup with a given name.
   * @param {string} name - The name of the subgroup.
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Create an HTML table summarizing a list of subgroups with their counts and percentages.
   * @param {Array} subGroups - Array of SubGroup objects with a `count` property.
   * @returns {string} - HTML string for a subgroup analysis table.
   */
  static createAnalysisTable(subGroups) {
    // Calculate total count across all subgroups
    const total = subGroups.reduce((sum, subGroup) => sum + subGroup.count, 0);

    // Sort subgroups by descending count
    const sorted = [...subGroups].sort((a, b) => b.count - a.count);

    // Start building the HTML table
    let html = `
      <table class="analysis-table">
        <thead>
          <tr>
            <th>Sub Group</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Add each subgroup as a table row
    sorted.forEach(subGroup => {
      const percent = ((subGroup.count / total) * 100).toFixed(1);
      html += `
        <tr>
          <td>${subGroup.name}</td>
          <td>${subGroup.count}</td>
          <td>${percent}%</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    return html;
  }

  /**
   * Return the name of the subgroup as a string.
   * @returns {string} - The name of the subgroup.
   */
  toString() {
    return this.name;
  }
}
