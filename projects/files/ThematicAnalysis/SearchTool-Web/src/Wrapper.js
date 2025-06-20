class Concept {
  constructor(concept, subGroup, techLayer) {
    this.concept = concept;
    this.subGroup = subGroup;
    this.techLayer = techLayer;
    this.cases = [];
  }


  // Find a case
  findCase(caseDescription) {
    return this.cases.find(entry => entry.description === caseDescription);
  }


  // Add a case if it doesn't exsist
  addCase(caseInstance) {
    if (!this.findCase(caseInstance.description)) {
      this.cases.push(caseInstance);
    }
  }


  toTableRow() {
    const conceptId = `concept_${this.concept.replace(/\s+/g, '_')}`;
    const subGroupId = `${conceptId}_subgroup`;
    const techLayerId = `${conceptId}_techlayer`;
    const casesId = `${conceptId}_cases`;

    let tableRow = `
    <tr class="collapsible" onclick="toggleRow('${conceptId}_details')">
      <th colspan="2" class="conceptHeading">
        <div class="headingLabel">Organizational Values</div>
        <div>${this.concept}</div>
      </th>
    </tr>
    <tr id="${conceptId}_details" style="display:none;">
      <td colspan="2" style="padding-left: 20px;"> <!-- Indent Sub Group -->
        <table border="1" width="95%">

          <!-- Sub Group Collapsible -->
          <tr class="collapsible" onclick="toggleRow('${subGroupId}')">
            <th colspan="2" class="subGroupHeading">
              <div class="headingLabel">Tech Concept</div>
              <div>${this.subGroup}</div>
            </th>
          </tr>
          <tr id="${subGroupId}" style="display:none;">
            <td colspan="2" style="padding-left: 20px;"> <!-- Indent Tech Layer -->
              <table border="1" width="90%">

                <!-- Tech Layer Collapsible -->
                <tr class="collapsible" onclick="toggleRow('${techLayerId}')">
                  <th colspan="2" class="subConceptHeading">
                    <div class="headingLabel">Tech Layers</div>
                    <div>${this.techLayer}</div>
                  </th>
                </tr>
                <tr id="${techLayerId}" style="display:none;">
                  <td colspan="2" style="padding-left: 20px;"> <!-- Indent Cases -->
                    <table border="1" width="85%">

                      <!-- Cases Section -->
                      <tr class="collapsible" onclick="toggleRow('${casesId}')">
                        <th colspan="2" class="caseHeading">
                          <div class="headingLabel">Extracts</div>
                          <div>Cases</div>
                        </th>
                      </tr>
                      <tr id="${casesId}" style="display:none;">
                        <td colspan="2">
                          <table border="1" width="100%">`;

    this.cases.forEach((caseItem, index) => {
      tableRow += `
                            <tr>
                              <td>${index + 1}. ${caseItem.description}</td>
                            </tr>`;
    });

    tableRow += `
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>`;

    return tableRow;
}



  // To string for Concept
  toString() {
    return `Concept: ${this.concept}, Tech Layer: ${this.techLayer}, Cases: ${this.cases.map(c => c.toString()).join(', ')}`;
  }
}
