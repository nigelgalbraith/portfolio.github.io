let extractname = "Cases";
let subCatergoryname = "Tech Layers";
let catergoryName = "Tech Catergory";
let subGroupName = "Organizational Values";

class Catergory {
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


  // Add a case if it doesn't exsist
  addExtract(extractInstance) {
    if (!this.findExtract(extractInstance.description)) {
      this.extracts.push(extractInstance);
    }
  }


  toTableRow() {
    const wrapperId = `wrapper_${this.catergory.replace(/\s+/g, '_')}`;
    const subGroupId = `${wrapperId}_subgroup`;
    const subCatergoryId = `${wrapperId}_subCatergory`;
    const extractId = `${wrapperId}_extracts`;

    let tableRow = `
    <tr class="collapsible" onclick="toggleRow('${wrapperId}_details')">
      <th colspan="2" class="conceptHeading">
        <div class="headingLabel">${subGroupName}</div>
        <div>${this.catergory}</div>
      </th>
    </tr>
    <tr id="${wrapperId}_details" style="display:none;">
      <td colspan="2" style="padding-left: 20px;"> <!-- Indent Sub Group -->
        <table border="1" width="95%">

          <!-- Sub Group Collapsible -->
          <tr class="collapsible" onclick="toggleRow('${subGroupId}')">
            <th colspan="2" class="subGroupHeading">
              <div class="headingLabel">${catergoryName}</div>
              <div>${this.subGroupName}</div>
            </th>
          </tr>
          <tr id="${subGroupId}" style="display:none;">
            <td colspan="2" style="padding-left: 20px;"> <!-- Indent Tech Layer -->
              <table border="1" width="90%">

                <!-- Tech Layer Collapsible -->
                <tr class="collapsible" onclick="toggleRow('${subCatergoryId}')">
                  <th colspan="2" class="subConceptHeading">
                    <div class="headingLabel">${subCatergoryname}</div>
                    <div>${this.subCatergoryName}</div>
                  </th>
                </tr>
                <tr id="${subCatergoryId}" style="display:none;">
                  <td colspan="2" style="padding-left: 20px;"> <!-- Indent Cases -->
                    <table border="1" width="85%">

                      <!-- Cases Section -->
                      <tr class="collapsible" onclick="toggleRow('${extractId}')">
                        <th colspan="2" class="caseHeading">
                          <div>${extractname}</div>
                        </th>
                      </tr>
                      <tr id="${extractId}" style="display:none;">
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
