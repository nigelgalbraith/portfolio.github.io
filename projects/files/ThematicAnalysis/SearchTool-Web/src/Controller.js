class Controller {
  static setup(jsonData) {
    const theSearchTool = new SearchTool('Research Search Tool');

    jsonData.forEach(entry => {
      const useCase = entry["Extracts"];
      const wrappers = entry["Wrapper"];

      if (wrappers && Array.isArray(wrappers)) {
        wrappers.forEach(wrapperData => {
          const challengeName = wrapperData["Factors"];
          const broadTechConcept = wrapperData["Groups"];
          const subGroup = wrapperData["Sub Groups"];
          const conceptName = wrapperData["Catergories"];
          const techLayer = wrapperData["Sub Catergories"];

          // 1. Find or create the Challenge
          let challenge = theSearchTool.findChallenge(challengeName);
          if (!challenge) {
            challenge = new Challenge(challengeName);
            theSearchTool.addChallenge(challenge);
          }

          // 2. Find or create the BroadConcept
          let broadConcept = challenge.findBroadConcept(broadTechConcept);
          if (!broadConcept) {
            broadConcept = new BroadConcept(broadTechConcept);
            challenge.addBroadConcept(broadConcept);
          }

          // 3. Find or create the Concept
          let concept = broadConcept.findConcept(conceptName);
          if (!concept) {
            concept = new Concept(conceptName, subGroup, techLayer);
            broadConcept.addConcept(concept);
          }

          // 4. Add the Case
          const caseInstance = new Case(useCase);
          concept.addCase(caseInstance);
        });
      } else {
        console.error("Wrapper array is undefined or not an array:", entry);
      }
    });

    return theSearchTool;
  }
}
