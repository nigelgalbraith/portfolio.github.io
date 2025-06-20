class Controller {
  static setup(jsonData) {
    const theSearchTool = new SearchTool('Research Search Tool');

    jsonData.forEach(entry => {
      const extract = entry["Extracts"];
      const wrappers = entry["Wrapper"];

      if (wrappers && Array.isArray(wrappers)) {
        wrappers.forEach(wrapperData => {
          const factorName = wrapperData["Factors"];
          const groupName = wrapperData["Groups"];
          const subGroupName = wrapperData["Sub Groups"];
          const catergoryName = wrapperData["Catergories"];
          const subCatergoryName = wrapperData["Sub Catergories"];

          // 1. Find or create the Factor
          let factor = theSearchTool.findFactor(factorName);
          if (!factor) {
            factor = new Factor(factorName);
            theSearchTool.addFactor(factor);
          }

          // 2. Find or create the Group
          let group = factor.findGroup(groupName);
          if (!group) {
            group = new Group(groupName);
            factor.addGroup(group);
          }

          // 3. Find or create the Catergory
          let catergory = group.findCatergory(catergoryName);
          if (!catergory) {
            catergory = new Catergory(catergoryName, subGroupName, subCatergoryName);
            group.addCatergory(catergory);
          }

          // 4. Add the Extract
          const extractInstance = new Extract(extract);
          catergory.addExtract(extractInstance);
        });
      } else {
        console.error("Wrapper array is undefined or not an array:", entry);
      }
    });

    return theSearchTool;
  }
}
