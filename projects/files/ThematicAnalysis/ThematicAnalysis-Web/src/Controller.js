class Controller {
  static setup(jsonData) {
    const extracts = [];

    jsonData.forEach(entry => {
      const extract = new Extract(entry);

      // Use actual JSON property names here
      if (entry.Factors && Array.isArray(entry.Factors)) {
        entry.Factors.forEach(name => {
          const factor = new Factor(name);
          extract.addFactor(factor);
        });
      }

      if (entry["Groups"] && Array.isArray(entry["Groups"])) {
        entry["Groups"].forEach(name => {
          const group = new Group(name);
          extract.addGroup(group);
        });
      }

      if (entry["Sub Groups"] && Array.isArray(entry["Sub Groups"])) {
        entry["Sub Groups"].forEach(name => {
          const subGroup = new SubGroup(name);
          extract.addSubGroup(subGroup);
        });
      }

      extract.sortFactors();
      extract.sortGroups();
      extract.sortSubGroups();

      extracts.push(extract);
    });

    return extracts;
  }
}
