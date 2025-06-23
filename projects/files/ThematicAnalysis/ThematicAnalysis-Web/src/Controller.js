class Controller {
  static setup(jsonData) {
    return jsonData.map(entry => {
      const extract = new Extract(entry);
      
      // Process factors
      const factors = entry.Factors || [];
      factors.forEach(factorName => {
        const factor = extract.addFactor(factorName);
        
        // Process groups for this factor
        const groups = entry.Groups || [];
        groups.forEach(groupName => {
          const group = new Group(groupName);
          factor.addGroup(group);
          
          // Process subgroups for this group
          const subGroups = entry["Sub Groups"] || [];
          subGroups.forEach(subGroupName => {
            group.addSubGroup(new SubGroup(subGroupName));
          });
        });
      });
      
      return extract;
    });
  }
}