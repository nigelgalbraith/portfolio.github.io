class Group {
  constructor(group) {
    this.group = group;
    this.wrappers = [];
  }


  // Find the Catergory
  findCatergory(catergoryName) {
    return this.wrappers.find(entry => entry.catergory === catergoryName);
  }


  // Add a catergory if it doesn't already exsist
  addCatergory(catergory) {
    if (!this.findCatergory(catergory.catergory)) {
      this.wrappers.push(catergory);
    }
  }


  // Function to sort wrappers array in ascending order
  sortWrapper(wrappers) {
    return wrappers.sort((a, b) => {
        if (typeof a.catergory === 'number' && typeof b.catergory === 'number') {
            return a.catergory - b.catergory; // Numeric comparison
        }
        return a.catergory.localeCompare(b.catergory); // String comparison
    });
  }


  // Create a table to display the Groups & relating wrappers
  toTable() {
    // Create Group headings
    let table = `<table border="1">`;
    table += `<tr id="group-${this.group}" onclick="toggleConcepts('group-${this.group}')"><td>${this.group}</td></tr>`;
    table += `<tr id="catergory-${this.group}" class="hidden"><td><ul>`;
    // Iterate over sorted wrappers
    this.wrappers.forEach(catergory => {
        table += `<li>${catergory.catergory}</li>`;
    });
    table += `</ul></td></tr></table>`;
    return table;
}




  // To string for Groups
  toString() {
    return `Group: ${this.group}, Wrappers: ${this.wrappers.map(c => c.toString()).join(', ')}`;
  }
}
