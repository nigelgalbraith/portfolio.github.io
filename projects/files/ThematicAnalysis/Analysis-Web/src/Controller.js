class Controller {
  static setup(jsonData) {
    const theSearchTool = new SearchTool('Research Search Tool');

    // Iterate over each entry in the JSON data
    jsonData.forEach(entry => {
      // Extract data from the entry
      const useCase = entry["Use Case"];
      const concepts = entry["Concepts"];

      // Ensure concepts is defined
      if (concepts && Array.isArray(concepts)) {
        // Iterate over each concept
        concepts.forEach(conceptData => {
          // Extract concept data
          const broadTechConcept = conceptData["Organizational Value"];
          const techConcept = conceptData["Tech Concepts"];
          const techLayers = conceptData["Tech Layers"];
          const challengeName = conceptData["Concern"];

          // Find or create the challenge
          let challenge = theSearchTool.findChallenge(challengeName);
          if (!challenge) {
            challenge = new Challenge(challengeName);
            theSearchTool.addChallenge(challenge);
          }

          // Find or create the broad tech concept
          let broadConcept = challenge.findBroadConcept(broadTechConcept);
          if (!broadConcept) {
            broadConcept = new BroadConcept(broadTechConcept);
            challenge.addBroadConcept(broadConcept);
          }

          // Find or create the concept
          let concept = broadConcept.findConcept(techConcept);
          if (!concept) {
            concept = new Concept(techConcept, techLayers);
            broadConcept.addConcept(concept);
          }

          // Create and add the case instance
          const caseInstance = new Case(useCase);
          concept.addCase(caseInstance);
        });
      } else {
        console.error("Concepts array is undefined or not an array:", entry);
      }
    });

    return theSearchTool;
  }
}
