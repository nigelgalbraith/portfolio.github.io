class RiskMatrix {
  constructor(data) {
    this.data = data;  // your jsonDataRisk object
  }

  lookup(value) {
    for (const key in this.data) {
      const entry = this.data[key];
      if (value >= entry.Min && value < entry.Max) {
        return entry;
      }
    }
    return null;
  }

  renderHTML(value) {
    const matched = this.lookup(value);
    if (!matched) return '<h2 class="centre-heading">No matching risk level found.</h2>';

    let html = '<table class="risk-matrix-table">';
    html += `
      <thead>
        <tr>
          <th>Level</th><th>Min</th><th>Max</th><th>Descriptor</th><th>Definition</th>
        </tr>
      </thead>
      <tbody>
    `;

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
