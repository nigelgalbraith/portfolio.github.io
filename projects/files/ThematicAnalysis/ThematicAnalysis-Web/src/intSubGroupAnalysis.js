function createSubGroupTable(subGroup) {
  const counts = {};
  let total = 0;

  // Count occurrences of each factor
  subGroup.forEach(f => {
    const name = f.name;
    if (!counts[name]) counts[name] = 0;
    counts[name]++;
    total++;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  // Generate HTML table
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

function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");

  const allSubGroups = [];
  extracts.forEach(extract => {
    allSubGroups.push(...extract.subGroups);
  });

  const tableHTML = createSubGroupTable(allSubGroups);
  container.innerHTML = tableHTML;
}

window.onload = main;
