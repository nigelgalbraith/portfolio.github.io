let factorName = "Challenge";
let groupName = "Possible Solutions";

class Challenge {
  constructor(challenge) {
    this.challenge = challenge;
    this.broadConcepts = [];
  }


  // Find BroadConcept method
  findBroadConcept(broadConceptName) {
    return this.broadConcepts.find(entry => entry.broadConcept === broadConceptName);
  }

  // Add BroadConcept if it doesn't exsist
  addBroadConcept(broadConcept) {
    if (!this.findBroadConcept(broadConcept.broadConcept)) {
      this.broadConcepts.push(broadConcept);
    }
  }


  // Function to sort broad concepts array alphabetically
  sortBroadConcepts(broadConcepts) {
    return broadConcepts.sort((a, b) => {
        return a.broadConcept.localeCompare(b.broadConcept); // String comparison
    });
  }


  // Function to sort concepts array in ascending order
  sortConcepts(concepts) {
    return concepts.sort((a, b) => {
      return a.conceptValue - b.conceptValue; // Assuming 'conceptValue' is the property to sort by
   });
  }
    

  // Create a BroadConcept table for a challenge
  toTable() {
    // Sort the broad concepts array using the separate sort function
    const sortedBroadConcepts = this.sortBroadConcepts(this.broadConcepts);

    let table = `<table border="1">`;
    
    // Challenge heading with label
    table += `
      <tr>
        <th colspan="2" class="challengeHeading">
          <div class="headingLabel">${factorName}</div>
          <div>${this.challenge}</div>
        </th>
      </tr>`;

    // Add rows for broad concepts
    sortedBroadConcepts.forEach((broadConcept) => {
      table += `
        <tr class="collapsible" onclick="toggleRow('broad_${broadConcept.broadConcept}_concepts')">
          <th colspan="2" class="broadConceptHeading">
            <div class="headingLabel">${groupName}</div>
            <div>${broadConcept.broadConcept}</div>
          </th>
        </tr>
        <tr id="broad_${broadConcept.broadConcept}_concepts" style="display:none;">
          <td colspan="2">
            <table border="1">`;

      // Add rows for concepts
      broadConcept.concepts.forEach((concept) => {
        table += concept.toTableRow();
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
    return `Challenge: ${this.challenge}, Broad Concepts: ${this.broadConcepts.map(bc => bc.toString()).join(', ')}`;
  }
}
