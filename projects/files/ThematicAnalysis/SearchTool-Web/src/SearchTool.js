class SearchTool {
  constructor(name) {
    this.name = name;
    this.factors = [];
  }


  // Find factor method
  findFactor(factorName) {
    return this.factors.find(entry => entry.factor === factorName);
  }


  // Add a factor if it doesn't exsist
  addFactor(newFactor) {
    if (!this.findFactor(newFactor.factor)) {
      this.factors.push(newFactor);
    }
  }


  // Function to sort factors array in ascending order
  sortFactors(factors) {
    return factors.sort((a, b) => {
        if (typeof a.factor === 'number' && typeof b.factor === 'number') {
            return a.factor - b.factor; // Numeric comparison
        }
        return a.factor.localeCompare(b.factor); // String comparison
    });
  }


  // Populate the factor dropdown list
  populateFactorDropdown() {
    // Create a factor element and initialize
    const FactorSelect = document.getElementById('FactorSelect');
    FactorSelect.innerHTML = '';

    // Sort the factors array using the separate sort function
    const sortedFactors = this.sortFactors(this.factors);

    // Add each factor to the dropdown list
    sortedFactors.forEach(factor => {
        const option = document.createElement('option');
        option.value = factor.factor;
        option.text = factor.factor;
        FactorSelect.appendChild(option);
    });
  }


  // Update the current table based on the list selection
  updateTable() {
    // Create a table heading with selected challenege and initiaize broadconcept element
    const FactorSelect = document.getElementById('FactorSelect');
    const selectedFactorName = FactorSelect.value;
    const selectedFactor = this.findFactor(selectedFactorName);
    const searchToolInfo = document.getElementById('searchToolInfo');
    searchToolInfo.innerHTML = '';
    
    // Create an internal table element
    if (selectedFactor) {
      const tableHTML = selectedFactor.toTable();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tableHTML;
      
      // Listener to collapse extend when pressed
      tempDiv.querySelectorAll('.collapsible').forEach(function (heading) {
        heading.addEventListener('click', function () {
          const content = this.nextElementSibling;
          content.style.display = (content.style.display === "none" || content.style.display === "") ? "table-row" : "none";
        });
      });
      
      // Create a element when pressed
      searchToolInfo.appendChild(tempDiv.firstChild);
    }
  }
  
  // To string for SearchTool
  toString() {
    return `Search Tool: ${this.name}, Factors: ${this.factors.map(c => c.toString()).join(', ')}`;
  }
}
