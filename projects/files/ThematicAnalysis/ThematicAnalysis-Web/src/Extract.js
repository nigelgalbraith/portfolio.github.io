class Extract {
  constructor(entry) {
    // Initialize extract-level properties from data entry
    this.id = entry.ID;
    this.reference = entry.References;
    this.extract = entry.Extracts;
    this.facts = entry.Facts;
    this.notes = entry["Notes/Additional"] || null;
    this.factors = []; // Holds Factor instances assigned to this extract
  }

  //========================
  // Instance-level Methods
  //========================

  // Find a factor by name (if already added)
  findFactor(name) {
    return this.factors.find(f => f.name === name);
  }

  // Add a factor if it doesn't already exist, return the factor
  addFactor(name) {
    let factor = this.findFactor(name);
    if (!factor) {
      factor = new Factor(name);
      this.factors.push(factor);
    }
    return factor;
  }

  // Sort factors alphabetically by name
  sortFactors() {
    this.factors.sort((a, b) => a.name.localeCompare(b.name));
  }

  //=====================
  // Static Utility Methods
  //=====================

  // Collect all factors from a list of extracts
  static getAllFactors(extracts) {
    const allFactors = [];
    extracts.forEach(extract => {
      allFactors.push(...extract.factors);
    });
    return allFactors;
  }

  // Count how many extracts each group appears in
  static getGroupCounts(extracts) {
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
  }

  // Count how many extracts each subgroup appears in
  static getSubGroupCounts(extracts) {
    const subGroupCounts = {};
    extracts.forEach(extract => {
      const seenSubGroups = new Set();
      extract.factors.forEach(factor => {
        factor.groups.forEach(group => {
          group.subGroups.forEach(subGroup => {
            if (!seenSubGroups.has(subGroup.name)) {
              seenSubGroups.add(subGroup.name);
              subGroupCounts[subGroup.name] = (subGroupCounts[subGroup.name] || 0) + 1;
            }
          });
        });
      });
    });
    return subGroupCounts;
  }

  // Identify top N factors per group, based on mentions across extracts
  static getTopFactorsByGroup(extracts, limit) {
    const globalFactorCounts = {};
    const groupFactorMap = {};
    let totalFactorMentions = 0;

    // Tally global mentions and group-factor co-occurrence
    extracts.forEach(extract => {
      extract.factors.forEach(() => totalFactorMentions++);

      const seenFactors = new Set();
      extract.factors.forEach(factor => {
        if (!seenFactors.has(factor.name)) {
          globalFactorCounts[factor.name] = (globalFactorCounts[factor.name] || 0) + 1;
          seenFactors.add(factor.name);
        }
      });

      const seenCombos = new Set();
      extract.factors.forEach(factor => {
        factor.groups.forEach(group => {
          const comboKey = `${group.name}::${factor.name}`;
          if (!seenCombos.has(comboKey)) {
            groupFactorMap[group.name] = groupFactorMap[group.name] || {};
            groupFactorMap[group.name][factor.name] = (groupFactorMap[group.name][factor.name] || 0) + 1;
            seenCombos.add(comboKey);
          }
        });
      });
    });

    // Format and sort results per group
    const topFactorsByGroup = {};
    for (const group in groupFactorMap) {
      topFactorsByGroup[group] = Object.entries(groupFactorMap[group])
        .map(([factorName, count]) => ({
          name: factorName,
          percent: ((globalFactorCounts[factorName] / totalFactorMentions) * 100).toFixed(1)
        }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, limit);
    }

    return topFactorsByGroup;
  }

  //=====================
  // Getters for linked data
  //=====================

  // Get all groups (unique) from factors
  get groups() {
    return [...new Set(this.factors.flatMap(f => f.groups))];
  }

  // Get all subgroups (unique) from all groups
  get subGroups() {
    return [...new Set(this.factors.flatMap(f => 
      f.groups.flatMap(g => g.subGroups)
    ))];
  }

  //=====================
  // Presentation Methods
  //=====================

  // Pretty-print representation of the extract
  toString() {
    this.sortFactors();
    
    const factorNames = this.factors.map(f => f.name).join(", ") || "None";
    const groupNames = [...new Set(this.factors.flatMap(f => f.groups.map(g => g.name)))].join(", ") || "None";
    const subGroupNames = [...new Set(this.factors.flatMap(f => 
      f.groups.flatMap(g => g.subGroups.map(sg => sg.name))
    ))].join(", ") || "None";

    return `
            ID: ${this.id}
            Ref: ${this.reference}
            Extract: ${this.extract?.substring(0, 80)}...
            Facts: ${this.facts || "None"}
            Notes: ${this.notes || "None"}
            Factors: ${factorNames}
            Groups: ${groupNames}
            SubGroups: ${subGroupNames}
            `;
  }

  // Convert the extract to an HTML table row, with modal support
  toTableRow() {
    const modalId = `modal-extract-${this.id}`;
    const modalContentId = `modal-content-${this.id}`;

    const factorsDisplay = this.factors.map(f => f.name).join("<br><br>") || "None";
    const groupsDisplay = [...new Set(this.factors.flatMap(f => f.groups.map(g => g.name)))].join("<br><br>") || "None";
    const subGroupsDisplay = [...new Set(this.factors.flatMap(f => 
      f.groups.flatMap(g => g.subGroups.map(sg => sg.name))
    ))].join("<br><br>") || "None";

    return `
      <tr>
        <td>${this.id}</td>
        <td>${this.reference}</td>
        <td>
          <a href="#" class="extract-link" onclick="event.preventDefault(); showExtractModal('${modalId}', '${modalContentId}')">Extract</a>
          <div id="${modalId}" class="extract-modal hidden">
            <div class="extract-modal-content" id="${modalContentId}">
              <span class="close-modal" onclick="hideExtractModal('${modalId}')">&times;</span>
              <p>${this.extract}</p>
            </div>
          </div>
        </td>
        <td>${this.facts || "None"}</td>
        <td>${factorsDisplay}</td>
        <td>${groupsDisplay}</td>
        <td>${subGroupsDisplay}</td>
      </tr>
    `;
  }

  //=====================
  // Risk Score Evaluation
  //=====================

  // Calculate total risk score based on selected mitigation options
  static calculateRiskScoreDOM() {
    const factorRows = document.querySelectorAll('.factor-row');
    let totalRiskScore = 0;

    factorRows.forEach(row => {
      const select = row.querySelector('.mitigation-select');
      const percentCell = row.querySelector('.factor-percent');
      const rawPercent = parseFloat(row.dataset.factorAdjustedPercent || '0');

      if (select.value === 'N') {
        percentCell.textContent = `${rawPercent.toFixed(1)}%`;
        totalRiskScore += rawPercent;
      } else {
        percentCell.textContent = '0%';
      }
    });

    document.getElementById('total-risk-score').textContent = `${totalRiskScore.toFixed(1)}%`;
  }
}
