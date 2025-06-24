class Group {
  constructor(name) {
    this.name = name;
    this.subGroups = [];
  }

  findSubGroup(name) {
    return this.subGroups.find(sg => sg.name === name);
  }

  addSubGroup(subGroup) {
    if (!this.findSubGroup(subGroup.name)) {
      this.subGroups.push(subGroup);
    }
    return this;
  }

  static createAnalysisTable(groups) {
    const counts = {};
    let total = 0;

    groups.forEach(group => {
      counts[group.name] = group.count;
      total += group.count;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

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
    return this.name;
  }
}