function main() {
  const generateBtn = document.getElementById('generateRiskCatergories');
  const acceptanceInput = document.getElementById('acceptanceLevel');
  const factorLimitInput = document.getElementById('factorLimit');
  const resultsContainer = document.getElementById('RiskCatergories');

  if (!generateBtn || !acceptanceInput || !factorLimitInput || !resultsContainer) {
    console.error("Missing required HTML elements.");
    return;
  }

  generateBtn.addEventListener('click', function() {
    const acceptanceLevel = parseFloat(acceptanceInput.value);
    const factorLimit = parseInt(factorLimitInput.value) || 3;
    const extracts = Controller.setup(jsonDataThematic);

    const groupCounts = Extract.getGroupCounts(extracts);
    const totalCount = Object.values(groupCounts).reduce((sum, count) => sum + count, 0);

    const groupsArray = Object.entries(groupCounts).map(([name, count]) => ({
      name,
      count,
      percent: (count / totalCount * 100).toFixed(1)
    }));

    const acceptedGroups = groupsArray
      .filter(g => parseFloat(g.percent) >= acceptanceLevel)
      .sort((a, b) => b.percent - a.percent);

    if (acceptedGroups.length === 0) {
      resultsContainer.innerHTML = `<p>No groups meet the specified acceptance level.</p>`;
      return;
    }

    const topFactorsByGroup = Extract.getTopFactorsByGroup(extracts, factorLimit);

    let html = `
      <table class="risk-group-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Group %</th>
            <th>Top ${factorLimit} Factors</th>
          </tr>
        </thead>
        <tbody>
    `;

    acceptedGroups.forEach(g => {
      const factors = topFactorsByGroup[g.name] || [];

      html += `
        <tr>
          <td>${g.name}</td>
          <td>${g.percent}%</td>
          <td>
            ${factors.map(f => `${f.name} (${f.percent}%)`).join('<br>')}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    resultsContainer.innerHTML = html;
  });
}

document.addEventListener("DOMContentLoaded", main);