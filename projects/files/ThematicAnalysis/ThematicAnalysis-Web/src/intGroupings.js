function mainGroupings() {
  const extracts = Controller.setup(jsonDataThematic);
  const factorMap = new Map();

  extracts.forEach(extract => {
    // Create a map of all possible combinations
    extract.factors.forEach(factor => {
      if (!factorMap.has(factor.name)) {
        // Find first matching group (if any)
        const group = extract.groups.length > 0 ? extract.groups[0].name : "";
        // Find first matching subgroup (if any)
        const subGroup = extract.subGroups.length > 0 ? extract.subGroups[0].name : "";
        
        factorMap.set(factor.name, { 
          group, 
          subGroup 
        });
      }
    });
  });

  const factors = Array.from(factorMap.keys()).sort();

  let html = `
    <table class="styled-table">
      <thead>
        <tr>
          <th class="grouping-table">Factor</th>
          <th class="grouping-table">Group</th>
          <th class="grouping-table">Sub Group</th>
        </tr>
      </thead>
      <tbody>
  `;

  factors.forEach(factorName => {
    const { group, subGroup } = factorMap.get(factorName);
    html += `
      <tr>
        <td>${factorName}</td>
        <td>${group || ""}</td>
        <td>${subGroup || ""}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  document.getElementById('groupings-container').innerHTML = html;
}

window.onload = mainGroupings;