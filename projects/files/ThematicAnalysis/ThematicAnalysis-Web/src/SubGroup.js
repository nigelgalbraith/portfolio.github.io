// SubGroup.js
class SubGroup {
  constructor(name) {
    this.name = name;
  }

static createAnalysisTable(subGroups) {
  const total = subGroups.reduce((sum, subGroup) => sum + subGroup.count, 0);
  
  // Sort by count descending
  const sorted = [...subGroups].sort((a, b) => b.count - a.count);

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

  toString() {
    return this.name;
  }
}