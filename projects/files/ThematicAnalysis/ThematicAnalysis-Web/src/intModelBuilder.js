function main() {
  const generateBtn = document.getElementById('generateModel');
  const acceptanceInput = document.getElementById('acceptanceLevel');
  const factorLimitInput = document.getElementById('factorLimit');
  const resultsContainer = document.getElementById('modelResults');

  if (!generateBtn || !acceptanceInput || !factorLimitInput || !resultsContainer) {
    console.error("Missing required HTML elements.");
    return;
  }

  generateBtn.addEventListener('click', function () {
    const acceptanceLevel = parseFloat(acceptanceInput.value);
    const factorLimit = parseInt(factorLimitInput.value) || 3;
    const extracts = Controller.setup(jsonDataThematic);

    const groupCounts = Extract.getGroupCounts(extracts);
    const totalCount = Object.values(groupCounts).reduce((sum, count) => sum + count, 0);

    // Prepare array with original percentages
    const groupsArray = Object.entries(groupCounts).map(([name, count]) => ({
      name,
      count,
      percent: (count / totalCount * 100).toFixed(1)
    }));

    // Filter groups by acceptance level
    const acceptedGroups = groupsArray
      .filter(g => parseFloat(g.percent) >= acceptanceLevel)
      .sort((a, b) => b.percent - a.percent);

    if (acceptedGroups.length === 0) {
      resultsContainer.innerHTML = `<p>No groups meet the specified acceptance level.</p>`;
      return;
    }

    // Get top factors for each group
    const topFactorsByGroup = Extract.getTopFactorsByGroup(extracts, factorLimit, totalCount);

    // Build HTML table
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
          <td colspan="3">
    
          </td>
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

// === Static method to count how many extracts reference each group (once per extract) ===
Extract.getGroupCounts = function(extracts) {
  const counts = {};
  extracts.forEach(extract => {
    const uniqueGroups = new Set();
    extract.factors.forEach(factor => {
      factor.groups.forEach(group => {
        uniqueGroups.add(group.name);
      });
    });
    uniqueGroups.forEach(groupName => {
      counts[groupName] = (counts[groupName] || 0) + 1;
    });
  });

  return counts;
};

// === Static method to get top factors per group (percent relative to total extracts) ===
Extract.getTopFactorsByGroup = function(extracts, limit) {
  const globalFactorCounts = {};
  const groupFactorMap = {};

  // Step 0: Count total factor mentions (including duplicates) for percentage denominator
  let totalFactorMentions = 0;
  extracts.forEach(extract => {
    extract.factors.forEach(() => {
      totalFactorMentions++;
    });
  });

  // Step 1: Count how many extracts mention each factor globally (for other uses if needed)
  extracts.forEach(extract => {
    const seenFactors = new Set();
    extract.factors.forEach(factor => {
      if (!seenFactors.has(factor.name)) {
        globalFactorCounts[factor.name] = (globalFactorCounts[factor.name] || 0) + 1;
        seenFactors.add(factor.name);
      }
    });
  });

  // Step 2: Map group -> factor counts (local)
  extracts.forEach(extract => {
    const seenCombos = new Set(); // avoid duplicate factor-group per extract
    extract.factors.forEach(factor => {
      factor.groups.forEach(group => {
        const groupName = group.name;
        const factorName = factor.name;
        const comboKey = `${groupName}::${factorName}`;

        if (!seenCombos.has(comboKey)) {
          if (!groupFactorMap[groupName]) {
            groupFactorMap[groupName] = {};
          }
          groupFactorMap[groupName][factorName] = (groupFactorMap[groupName][factorName] || 0) + 1;
          seenCombos.add(comboKey);
        }
      });
    });
  });

  // Step 3: For each group, list top factors using percentages relative to total factor mentions
  const topFactorsByGroup = {};
  for (const group in groupFactorMap) {
    const factorList = Object.entries(groupFactorMap[group])
      .map(([factorName, count]) => {
        const globalCount = globalFactorCounts[factorName] || 0;
        // Use totalFactorMentions as denominator, not totalExtracts
        return {
          name: factorName,
          percent: ((globalCount / totalFactorMentions) * 100).toFixed(1)
        };
      })
      .sort((a, b) => b.percent - a.percent)
      .slice(0, limit);

    topFactorsByGroup[group] = factorList;
  }

  return topFactorsByGroup;
};
