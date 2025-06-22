class SubGroup {
  constructor(name) {
    this.name = name;
  }

  static createAnalysisTable(subGroups) {
    const counts = {};
    let total = 0;

    subGroups.forEach(sg => {
      const name = sg.name;
      if (!counts[name]) counts[name] = 0;
      counts[name]++;
      total++;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    let html = `
      <table>
        <thead>
          <tr>
            <th>Sub Group</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
    `;

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

    html += '</tbody></table>';
    return html;
  }

  toString() {
    return `SubGroup: ${this.name}`;
  }
}
