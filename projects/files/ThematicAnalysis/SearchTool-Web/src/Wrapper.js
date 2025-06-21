class Catergory {
  static extractname = "Cases";
  static subCatergoryname = "Tech Layers";
  static catergoryName = "Tech Catergory";
  static subGroupName = "Organizational Values";

  constructor(catergory, subGroupName, subCatergoryName) {
    this.catergory = catergory;
    this.subGroupName = subGroupName;
    this.subCatergoryName = subCatergoryName;
    this.extracts = [];
  }

  // Find a case
  findExtract(caseDescription) {
    return this.extracts.find(entry => entry.description === caseDescription);
  }

  // Add a case if it doesn't exist
  addExtract(extractInstance) {
    if (!this.findExtract(extractInstance.description)) {
      this.extracts.push(extractInstance);
    }
  }

  toTableRow() {
    const wrapperId = `wrapper_${this.catergory.replace(/\s+/g, '_')}`;
    const subGroupId = `${wrapperId}_subgroup`;
    const subCatergoryId = `${wrapperId}_subCatergory`;
    const extractBlockId = `${wrapperId}_extractBlock`;

    let tableRow = `
      <tr class="collapsible" onclick="toggleRow('${wrapperId}_details')">
        <th colspan="2" class="conceptHeading">
          <div class="headingLabel">${Catergory.subGroupName}</div>
          <div>${this.catergory}</div>
        </th>
      </tr>
      <tr id="${wrapperId}_details" style="display:none;">
        <td colspan="2" style="padding-left: 20px;">
          <table border="1" width="95%">

            <!-- Sub Group Collapsible -->
            <tr class="collapsible" onclick="toggleRow('${subGroupId}')">
              <th colspan="2" class="subGroupHeading">
                <div class="headingLabel">${Catergory.catergoryName}</div>
                <div>${this.subGroupName}</div>
              </th>
            </tr>
            <tr id="${subGroupId}" style="display:none;">
              <td colspan="2" style="padding-left: 20px;">
                <table border="1" width="90%">

                  <!-- Tech Layer Collapsible -->
                  <tr class="collapsible" onclick="toggleRow('${subCatergoryId}')">
                    <th colspan="2" class="subConceptHeading">
                      <div>${Catergory.subCatergoryname}</div>
                    </th>
                  </tr>
                  <tr id="${subCatergoryId}" style="display:none;">
                    <td colspan="2" style="padding-left: 20px;">
                      <table border="1" width="100%">
                        <tr>
                          <td>${this.subCatergoryName}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Cases Collapsible -->
                  <tr class="collapsible" onclick="toggleRow('${extractBlockId}')">
                    <th colspan="2" class="caseHeading">
                      <div>${Catergory.extractname}</div>
                    </th>
                  </tr>
                  <tr id="${extractBlockId}" style="display:none;">
                    <td colspan="2">
                      <table border="1" width="100%">`;

    this.extracts.forEach((extractItem, index) => {
      tableRow += `
                        <tr>
                          <td>${index + 1}. ${extractItem.description}</td>
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
      </tr>`;

    return tableRow;
  }

  // To string for Catergory
  toString() {
    return `Catergory: ${this.catergory}, Sub Catergory: ${this.subCatergoryName}, Extracts: ${this.extracts.map(c => c.toString()).join(', ')}`;
  }
}