class Extract {
  constructor(entry) {
    this.id = entry.ID;
    this.reference = entry.References;
    this.extract = entry.Extracts;
    this.facts = entry.Facts;
    this.notes = entry["Notes/Additional"] || null;

    this.factors = [];
    this.groups = [];
    this.subGroups = [];
  }

  // Factor methods
  findFactor(name) {
    return this.factors.find(f => f.name === name);
  }

  addFactor(factorItem) {
    if (!this.findFactor(factorItem.name)) {
      this.factors.push(factorItem);
    }
  }

  sortFactors() {
    this.factors.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Group methods
  findGroup(name) {
    return this.groups.find(g => g.name === name);
  }

  addGroup(groupItem) {
    if (!this.findGroup(groupItem.name)) {
      this.groups.push(groupItem);
    }
  }

  sortGroups() {
    this.groups.sort((a, b) => a.name.localeCompare(b.name));
  }

  // SubGroup methods
  findSubGroup(name) {
    return this.subGroups.find(sg => sg.name === name);
  }

  addSubGroup(subGroupItem) {
    if (!this.findSubGroup(subGroupItem.name)) {
      this.subGroups.push(subGroupItem);
    }
  }

  sortSubGroups() {
    this.subGroups.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Collection methods
  static getAllFactors(extracts) {
    const allFactors = [];
    extracts.forEach(extract => {
      allFactors.push(...extract.factors);
    });
    return allFactors;
  }

  static getAllGroups(extracts) {
    const allGroups = [];
    extracts.forEach(extract => {
      allGroups.push(...extract.groups);
    });
    return allGroups;
  }

  static getAllSubGroups(extracts) {
    const allSubGroups = [];
    extracts.forEach(extract => {
      allSubGroups.push(...extract.subGroups);
    });
    return allSubGroups;
  }

  toString() {
    this.sortFactors();
    this.sortGroups();
    this.sortSubGroups();

    const factorNames = this.factors.map(f => f.name).join(", ") || "None";
    const groupNames = this.groups.map(g => g.name).join(", ") || "None";
    const subGroupNames = this.subGroups.map(sg => sg.name).join(", ") || "None";

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
        <td>${this.factors.map(f => f.name).join("<br><br>") || "None"}</td>
        <td>${this.groups.map(g => g.name).join("<br><br>") || "None"}</td>
        <td>${this.subGroups.map(sg => sg.name).join("<br><br>") || "None"}</td>
      </tr>
    `;
  }
}
