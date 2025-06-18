class SearchTool {
  constructor(name) {
    this.name = name;
    this.challenges = [];
  }


  // Find challenge method
  findChallenge(challengeName) {
    return this.challenges.find(entry => entry.challenge === challengeName);
  }


  // Add a challenge if it doesn't exsist
  addChallenge(newChallenge) {
    if (!this.findChallenge(newChallenge.challenge)) {
      this.challenges.push(newChallenge);
    }
  }


  // Function to sort challenges array in ascending order
  sortChallenges(challenges) {
    return challenges.sort((a, b) => {
        if (typeof a.challenge === 'number' && typeof b.challenge === 'number') {
            return a.challenge - b.challenge; // Numeric comparison
        }
        return a.challenge.localeCompare(b.challenge); // String comparison
    });
  }


  // Populate the challenge dropdown list
  populateChallengeDropdown() {
    // Create a challenge element and initialize
    const challengeSelect = document.getElementById('challengeSelect');
    challengeSelect.innerHTML = '';

    // Sort the challenges array using the separate sort function
    const sortedChallenges = this.sortChallenges(this.challenges);

    // Add each challenge to the dropdown list
    sortedChallenges.forEach(challenge => {
        const option = document.createElement('option');
        option.value = challenge.challenge;
        option.text = challenge.challenge;
        challengeSelect.appendChild(option);
    });
  }


  // Update the current table based on the list selection
  updateTable() {
    // Create a table heading with selected challenege and initiaize broadconcept element
    const challengeSelect = document.getElementById('challengeSelect');
    const selectedChallengeName = challengeSelect.value;
    const selectedChallenge = this.findChallenge(selectedChallengeName);
    const searchToolInfo = document.getElementById('searchToolInfo');
    searchToolInfo.innerHTML = '';
    
    // Create an internal table element
    if (selectedChallenge) {
      const tableHTML = selectedChallenge.toTable();
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
    return `Search Tool: ${this.name}, Challenges: ${this.challenges.map(c => c.toString()).join(', ')}`;
  }
}
