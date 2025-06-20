let factorName = "Challenge";
let groupName = "Possible Solutions";

class Factor {
  constructor(factor) {
    this.factor = factor;
    this.groups = [];
  }


  // Find Group method
  findGroup(broadConceptName) {
    return this.groups.find(entry => entry.group === broadConceptName);
  }

  // Add Group if it doesn't exsist
  addGroup(group) {
    if (!this.findGroup(group.group)) {
      this.groups.push(group);
    }
  }


  // Function to sort broad wrappers array alphabetically
  sortGroups(groups) {
    return groups.sort((a, b) => {
        return a.group.localeCompare(b.group); // String comparison
    });
  }


  // Function to sort wrappers array in ascending order
  sortWrapper(wrappers) {
    return wrappers.sort((a, b) => {
      return a.conceptValue - b.conceptValue; // Assuming 'conceptValue' is the property to sort by
   });
  }
    

  // Create a Group table for a factor
  toTable() {
    // Sort the broad wrappers array using the separate sort function
    const sortedGroups = this.sortGroups(this.groups);

    let table = `<table border="1">`;
    
    // Factor heading with label
    table += `
      <tr>
        <th colspan="2" class="challengeHeading">
          <div class="headingLabel">${factorName}</div>
          <div>${this.factor}</div>
        </th>
      </tr>`;

    // Add rows for broad wrappers
    sortedGroups.forEach((group) => {
      table += `
        <tr class="collapsible" onclick="toggleRow('broad_${group.group}_concepts')">
          <th colspan="2" class="broadConceptHeading">
            <div class="headingLabel">${groupName}</div>
            <div>${group.group}</div>
          </th>
        </tr>
        <tr id="broad_${group.group}_concepts" style="display:none;">
          <td colspan="2">
            <table border="1">`;

      // Add rows for wrappers
      group.wrappers.forEach((catergory) => {
        table += catergory.toTableRow();
      });

      table += `
            </table>
          </td>
        </tr>`;
    });

    table += `</table>`;
    return table;
}

  // To string method for Challenges
  toString() {
    return `Factor: ${this.factor}, Group: ${this.groups.map(bc => bc.toString()).join(', ')}`;
  }
}
