class Extract {
  constructor(entry) {
    this.id = entry.ID;
    this.reference = entry.References;
    this.description = entry.Extracts;
    this.facts = entry.Facts;
    this.notes = entry["Notes/Additional"] || null;

    this.factors = [];
    this.groups = [];
    this.subGroups = [];
  }

  // Factor
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

  // Group
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

  // SubGroup
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
            Description: ${this.description?.substring(0, 80)}...
            Facts: ${this.facts || "None"}
            Notes: ${this.notes || "None"}
            Factors: ${factorNames}
            Groups: ${groupNames}
            SubGroups: ${subGroupNames}
            `;
  }

toTableRow() {
  this.sortFactors();
  this.sortGroups();
  this.sortSubGroups();

  const factorNames = this.factors.map(f => f.name).join("<br>") || "None";
  const groupNames = this.groups.map(g => g.name).join("<br>") || "None";
  const subGroupNames = this.subGroups.map(sg => sg.name).join("<br>") || "None";

  return `
    <tr>
      <td>${this.id}</td>
      <td>${this.reference}</td>
      <td>${this.description}</td>
      <td>${this.facts}</td>
      <td>${this.notes || "None"}</td>
      <td>${factorNames}</td>
      <td>${groupNames}</td>
      <td>${subGroupNames}</td>
    </tr>
  `;
}
}
