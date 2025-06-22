function createFactorTable(factors) {
  const counts = {};
  let total = 0;

  // Count occurrences of each factor
  factors.forEach(f => {
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

function main() {
  const extracts = Controller.setup(jsonDataThematic);
  const container = document.getElementById("analysis-container");

  const allFactors = [];
  extracts.forEach(extract => {
    allFactors.push(...extract.factors);
  });

  const tableHTML = createFactorTable(allFactors);
  container.innerHTML = tableHTML;
}

window.onload = main;
