class Factor {
  constructor(name) {
    this.name = name;
    this.groups = []; 
  }

  findGroup(name) {
    return this.groups.find(g => g.name === name);
  }

  addGroup(group) {
    if (!this.findGroup(group.name)) {
      this.groups.push(group);
    }
    return this; 
  }

  static createAnalysisTable(factors) {
    const counts = {};
    let total = 0;

    factors.forEach(f => {
      const name = f.name;
      if (!counts[name]) counts[name] = 0;
      counts[name]++;
      total++;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

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
    return `Factor: ${this.name}`;
  }
}
