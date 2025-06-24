let riskMatrix;

function main() {
  const generateBtn = document.getElementById('generateRiskCatergories');
  const acceptanceInput = document.getElementById('acceptanceLevel');
  const factorLimitInput = document.getElementById('factorLimit');
  const resultsContainer = document.getElementById('RiskCatergories');
  const riskMatrixContainer = document.getElementById('riskMatrixContainer');

  if (!generateBtn || !acceptanceInput || !factorLimitInput || !resultsContainer || !riskMatrixContainer) {
    console.error("Missing required HTML elements.");
    return;
  }

  riskMatrix = new RiskMatrix(jsonDataRisk);

  generateBtn.addEventListener('click', function () {
    const acceptanceLevel = parseFloat(acceptanceInput.value);
    const factorLimit = parseInt(factorLimitInput.value) || 3;
    const extracts = Controller.setup(jsonDataThematic);

    const groupCounts = Extract.getGroupCounts(extracts);
    const totalCount = Object.values(groupCounts).reduce((sum, count) => sum + count, 0);

    const groupsArray = Object.entries(groupCounts).map(([name, count]) => ({
      name,
      count,
      percent: (count / totalCount * 100)
    }));

    const acceptedGroups = groupsArray
      .filter(g => g.percent >= acceptanceLevel)
      .sort((a, b) => b.percent - a.percent);

    if (acceptedGroups.length === 0) {
      resultsContainer.innerHTML = `<p>No groups meet the specified acceptance level.</p>`;
      riskMatrixContainer.innerHTML = '';
      return;
    }

    const topFactorsByGroup = Extract.getTopFactorsByGroup(extracts, factorLimit);

    // Normalize group percentages so they add to 100%
    const totalAcceptedPercent = acceptedGroups.reduce((sum, g) => sum + g.percent, 0);
    acceptedGroups.forEach(g => g.normalizedPercent = (g.percent / totalAcceptedPercent) * 100);

    // Risk Categories Table
    let html = `
      <h2 class="centre-heading">Risk Categories</h2>
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
          <td>${g.normalizedPercent.toFixed(1)}%</td>
          <td>${factors.map(f => `${f.name} (${f.percent}%)`).join('<br>')}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    // Risk Assessment Model Table
    html += `
      <h2 class="centre-heading">Risk Assessment Model</h2>
      <table class="risk-assessment-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Group %</th>
            <th>Factors</th>
            <th>Mitigated</th>
            <th>Factor %</th>
          </tr>
        </thead>
        <tbody>
    `;

    acceptedGroups.forEach(g => {
      const factors = topFactorsByGroup[g.name] || [];
      const groupPercent = g.normalizedPercent;
      const factorPercent = groupPercent / factors.length;

      html += `
        <tr class="group-row" data-group="${g.name}">
          <td rowspan="${factors.length + 1}">${g.name}</td>
          <td class="group-percent" rowspan="${factors.length + 1}">${groupPercent.toFixed(1)}%</td>
        </tr>
      `;

      factors.forEach(f => {
        html += `
          <tr class="factor-row" data-group="${g.name}" data-factor-percent="${factorPercent.toFixed(4)}">
            <td>${f.name}</td>
            <td>
              <select class="mitigation-select">
                <option value="Y">Yes</option>
                <option value="N" selected>No</option>
              </select>
            </td>
            <td class="factor-percent">${factorPercent.toFixed(1)}%</td>
          </tr>
        `;
      });
    });

    html += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align: right;"><strong>Total Risk Score:</strong></td>
            <td id="total-risk-score">100.0%</td>
          </tr>
        </tfoot>
      </table>
    `;

    resultsContainer.innerHTML = html;

    document.querySelectorAll('.mitigation-select').forEach(select => {
      select.addEventListener('change', () => {
        calculateRiskScore();
        updateRiskMatrix();
      });
    });

    calculateRiskScore();
    updateRiskMatrix();
  });
}

function calculateRiskScore() {
  let total = 0;

  document.querySelectorAll('.factor-row').forEach(row => {
    const select = row.querySelector('.mitigation-select');
    const percentCell = row.querySelector('.factor-percent');
    const original = parseFloat(row.dataset.factorPercent);

    if (select.value === 'N') {
      percentCell.textContent = `${original.toFixed(1)}%`;
      total += original;
    } else {
      percentCell.textContent = `0.0%`;
    }
  });

  document.getElementById('total-risk-score').textContent = `${total.toFixed(1)}%`;
}

function updateRiskMatrix() {
  const totalText = document.getElementById('total-risk-score').textContent;
  if (!totalText) return;

  const value = parseFloat(totalText) / 100;
  const riskMatrixContainer = document.getElementById('riskMatrixContainer');
  if (riskMatrixContainer && riskMatrix) {
    riskMatrixContainer.innerHTML = riskMatrix.renderHTML(value);
  }
}

document.addEventListener("DOMContentLoaded", main);
