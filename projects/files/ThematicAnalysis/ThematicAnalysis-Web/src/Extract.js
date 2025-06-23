class Extract {
  constructor(entry) {
    this.id = entry.ID;
    this.reference = entry.References;
    this.extract = entry.Extracts;
    this.facts = entry.Facts;
    this.notes = entry["Notes/Additional"] || null;
    this.factors = []; // Only factors at extract level
  }

  // Factor methods
  findFactor(name) {
    return this.factors.find(f => f.name === name);
  }

  addFactor(name) {
    let factor = this.findFactor(name);
    if (!factor) {
      factor = new Factor(name);
      this.factors.push(factor);
    }
    return factor; // Return the factor for chaining
  }

  sortFactors() {
    this.factors.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Collection methods
  static getAllFactors(extracts) {
    const allFactors = [];
    extracts.forEach(extract => {
      allFactors.push(...extract.factors);
    });
    return allFactors;
  }

  static getGroupCounts(extracts) {
    const groupCounts = {};
    
    extracts.forEach(extract => {
      const seenGroups = new Set(); // Track groups per extract
      
      extract.factors.forEach(factor => {
        factor.groups.forEach(group => {
          if (!seenGroups.has(group.name)) {
            seenGroups.add(group.name);
            groupCounts[group.name] = (groupCounts[group.name] || 0) + 1;
          }
        });
      });
    });
    
    return groupCounts;
  }

  static getSubGroupCounts(extracts) {
    const subGroupCounts = {};
    
    extracts.forEach(extract => {
      const seenSubGroups = new Set(); // Track subgroups per extract
      
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


  get groups() {
    return [...new Set(this.factors.flatMap(f => f.groups))];
  }

  get subGroups() {
    return [...new Set(this.factors.flatMap(f => 
      f.groups.flatMap(g => g.subGroups)
    ))];
  }

  toString() {
    this.sortFactors();
    
    const factorNames = this.factors.map(f => f.name).join(", ") || "None";
    const groupNames = [...new Set(
      this.factors.flatMap(f => f.groups.map(g => g.name))
    )].join(", ") || "None";
    const subGroupNames = [...new Set(
      this.factors.flatMap(f => 
        f.groups.flatMap(g => g.subGroups.map(sg => sg.name))
      )
    )].join(", ") || "None";

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

  toTableRow() {
    const modalId = `modal-extract-${this.id}`;
    const modalContentId = `modal-content-${this.id}`;

    const factorsDisplay = this.factors.map(f => f.name).join("<br><br>") || "None";
    const groupsDisplay = [...new Set(
      this.factors.flatMap(f => f.groups.map(g => g.name))
    )].join("<br><br>") || "None";
    const subGroupsDisplay = [...new Set(
      this.factors.flatMap(f => 
        f.groups.flatMap(g => g.subGroups.map(sg => sg.name))
      )
    )].join("<br><br>") || "None";

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
}