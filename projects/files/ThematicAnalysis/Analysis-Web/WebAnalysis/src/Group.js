class Concept {
  constructor(concept, techLayer) {
    this.concept = concept;
    this.techLayer = techLayer;
    this.cases = [];
  }


  // Find a case
  findCase(caseDescription) {
    return this.cases.find(entry => entry.description === caseDescription);
  }


  // Add a case if it doesn't exsist
  addCase(caseInstance) {
    if (!this.findCase(caseInstance.description)) {
      this.cases.push(caseInstance);
    }
  }


  // Create a table row to display tech layers, cases & examples
  toTableRow() {
    // Display the tech layer row
    let tableRow = `
      <tr class="collapsible" onclick="toggleRow('concept_${this.concept}_cases')">
        <th colspan="2" class="conceptHeading">${this.concept}</th>
      </tr>
      <tr id="concept_${this.concept}_cases" style="display:none;">
        <td colspan="2">
          <table border="1">
            <tr>
              <th colspan="2" class="subConceptHeading">Tech Layer</th>
            </tr>
            <tr>
              <td colspan="2">${this.techLayer}</td>
            </tr>`;
    // Display the Case & exmaple row
    this.cases.forEach((caseItem) => {
      tableRow += `
            <tr>
              <th class="caseHeading">Case</th>
            </tr>
            <tr>
              <td>${caseItem.description}</td>
            </tr>`;
    });
    tableRow += `
          </table>
        </td>
      </tr>`;
    return tableRow;
  }


  // To string for Concept
  toString() {
    return `Concept: ${this.concept}, Tech Layer: ${this.techLayer}, Cases: ${this.cases.map(c => c.toString()).join(', ')}`;
  }
}
