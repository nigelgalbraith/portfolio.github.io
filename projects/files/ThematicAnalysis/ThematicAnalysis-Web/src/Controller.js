class Controller {
  static setup(jsonData) {
    const extracts = [];

    jsonData.forEach(entry => {
      const extract = new Extract(entry);

      // Handle Factors
      const factors = entry.Factors || entry.factors || entry.Wrapper?.map(w => w.Factors) || [];
      factors.flat().filter(Boolean).forEach(name => {
        extract.addFactor(new Factor(name));
      });

      // Handle Groups
      const groups = entry.Groups || entry.groups || entry.Wrapper?.map(w => w.Groups) || [];
      groups.flat().filter(Boolean).forEach(name => {
        extract.addGroup(new Group(name));
      });

      // Handle SubGroups
      const subGroups = entry["Sub Groups"] || entry.subGroups || entry.Wrapper?.map(w => w["Sub Groups"]) || [];
      subGroups.flat().filter(Boolean).forEach(name => {
        extract.addSubGroup(new SubGroup(name));
      });

      extract.sortFactors();
      extract.sortGroups();
      extract.sortSubGroups();
      extracts.push(extract);
    });

    return extracts;
  }
}