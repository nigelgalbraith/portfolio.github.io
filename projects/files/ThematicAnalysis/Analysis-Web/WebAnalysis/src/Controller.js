class Controller {
  static setup(jsonData) {
    const extracts = [];

    jsonData.forEach(entry => {
      const extract = new Extract(entry);

      // Use actual JSON property names here
      if (entry.Concern && Array.isArray(entry.Concern)) {
        entry.Concern.forEach(name => {
          const factor = new Factor(name);
          extract.addFactor(factor);
        });
      }

      if (entry["Possible Solutions"] && Array.isArray(entry["Possible Solutions"])) {
        entry["Possible Solutions"].forEach(name => {
          const group = new Group(name);
          extract.addGroup(group);
        });
      }

      if (entry["Organizational Values"] && Array.isArray(entry["Organizational Values"])) {
        entry["Organizational Values"].forEach(name => {
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
