function mainGroupings() {
  const extracts = Controller.setup(jsonDataThematic);

  // Map factor name => { group: string, subGroup: string }
  const factorMap = new Map();

  extracts.forEach(extract => {
    extract.factors.forEach((factor, index) => {
      const factorName = factor.name;
      if (!factorMap.has(factorName)) {
        const groupName = extract.groups[index] ? extract.groups[index].name : "";
        const subGroupName = extract.subGroups[index] ? extract.subGroups[index].name : "";
        factorMap.set(factorName, { group: groupName, subGroup: subGroupName });
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