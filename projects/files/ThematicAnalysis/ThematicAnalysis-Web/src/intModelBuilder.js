function main() {
  const generateBtn = document.getElementById('generateModel');
  const acceptanceInput = document.getElementById('acceptanceLevel');
  const resultsContainer = document.getElementById('modelResults');

  if (!generateBtn || !acceptanceInput || !resultsContainer) {
    console.error("Missing required HTML elements.");
    return;
  }

  generateBtn.addEventListener('click', function () {
    const acceptanceLevel = parseFloat(acceptanceInput.value);
    const extracts = Controller.setup(jsonDataThematic);

    const groupCounts = Extract.getGroupCounts(extracts);
    const totalCount = Object.values(groupCounts).reduce((sum, count) => sum + count, 0);

    // Prepare array with original percentages (relative to totalCount)
    const groupsArray = Object.entries(groupCounts).map(([name, count]) => ({
      name,
      count,
      percent: (count / totalCount * 100).toFixed(1)
    }));

    // Filter groups by acceptance level threshold
    const acceptedGroups = groupsArray
      .filter(g => parseFloat(g.percent) >= acceptanceLevel)
      .sort((a, b) => b.percent - a.percent);

    if (acceptedGroups.length === 0) {
      resultsContainer.innerHTML = `<p>No groups meet the specified acceptance level.</p>`;
      return;
    }

    // Build HTML table with original percentages
    let html = `
      <table class="risk-group-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
    `;

    acceptedGroups.forEach(g => {
      html += `
        <tr>
          <td>${g.name}</td>
          <td>${g.count}</td>
          <td>${g.percent}%</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    resultsContainer.innerHTML = html;
  });
}

document.addEventListener("DOMContentLoaded", main);
