/**
 * Class representing a Risk Matrix for project risk evaluation.
 */
class RiskMatrix {
  /**
   * Initialize with risk level data (usually from a JSON object).
   * @param {Object} data - The risk matrix data containing Min, Max, Descriptor, and Definition for each level.
   */
  constructor(data) {
    this.data = data;  // JSON object with risk level definitions
  }

  /**
   * Look up the appropriate risk level for a given score.
   * @param {number} value - Risk score (typically a decimal between 0 and 1).
   * @returns {Object|null} - The matching risk level entry, or null if not found.
   */
  lookup(value) {
    for (const key in this.data) {
      const entry = this.data[key];
      if (value >= entry.Min && value < entry.Max) {
        return entry;
      }
    }
    return null;
  }

  /**
   * Render the risk matrix table as HTML, highlighting the matching risk level.
   * Also shows a summary below the matrix.
   * @param {number} value - The calculated risk score to evaluate.
   * @returns {string} - HTML string containing the full risk matrix and summary.
   */
  renderHTML(value) {
    const matched = this.lookup(value); // Find the matching risk level

    if (!matched) {
      return '<h2 class="centre-heading">No matching risk level found.</h2>';
    }

    // Build the risk matrix table
    let html = '<table class="risk-matrix-table">';
    html += `
      <thead>
        <tr>
          <th>Level</th><th>Min</th><th>Max</th><th>Descriptor</th><th>Definition</th>
        </tr>
      </thead>
      <tbody>
    `;

    // Loop through each risk level to populate the matrix
    for (const level in this.data) {
      const entry = this.data[level];
      const highlightClass = entry === matched ? 'highlight-row' : '';
      html += `
        <tr class="${highlightClass}">
          <td>${level}</td>
          <td>${(entry.Min * 100).toFixed(1)}%</td>
          <td>${(entry.Max * 100).toFixed(1)}%</td>
          <td>${entry.Decriptor}</td>
          <td>${entry.Definition}</td>
        </tr>
      `;
    }

    html += '</tbody></table>';

    // Add a separate summary table for the matched descriptor and definition
    html += `
      <table class="risk-summary-table">
        <tbody>
          <tr><th class="tb-col-header">Project Outcome Descriptor</th><td>${matched.Decriptor}</td></tr>
          <tr><th class="tb-col-header">Project Outcome Definition</th><td>${matched.Definition}</td></tr>
        </tbody>
      </table>
    `;

    return html;
  }
}
