class BroadConcept {
  constructor(broadConcept) {
    this.broadConcept = broadConcept;
    this.concepts = [];
  }


  // Find the Concept
  findConcept(conceptName) {
    return this.concepts.find(entry => entry.concept === conceptName);
  }


  // Add a concept if it doesn't already exsist
  addConcept(concept) {
    if (!this.findConcept(concept.concept)) {
      this.concepts.push(concept);
    }
  }


  // Function to sort concepts array in ascending order
  sortConcepts(concepts) {
    return concepts.sort((a, b) => {
        if (typeof a.concept === 'number' && typeof b.concept === 'number') {
            return a.concept - b.concept; // Numeric comparison
        }
        return a.concept.localeCompare(b.concept); // String comparison
    });
  }


  // Create a table to display the BroadConcepts & relating concepts
  toTable() {
    // Create BroadConcept headings
    let table = `<table border="1">`;
    table += `<tr id="broadConcept-${this.broadConcept}" onclick="toggleConcepts('broadConcept-${this.broadConcept}')"><td>${this.broadConcept}</td></tr>`;
    table += `<tr id="concept-${this.broadConcept}" class="hidden"><td><ul>`;
    // Iterate over sorted concepts
    this.concepts.forEach(concept => {
        table += `<li>${concept.concept}</li>`;
    });
    table += `</ul></td></tr></table>`;
    return table;
}




  // To string for Broad Concepts
  toString() {
    return `Broad Concept: ${this.broadConcept}, Concepts: ${this.concepts.map(c => c.toString()).join(', ')}`;
  }
}
