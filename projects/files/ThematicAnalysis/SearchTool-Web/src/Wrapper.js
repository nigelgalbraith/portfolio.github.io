/**
 * Represents a category structure containing multiple extract cases.
 * The structure includes sub-categories and groups, used for rendering nested tables.
 */
class Catergory {
  // Static labels for display in generated HTML
  static extractname = "Cases";
  static subCatergoryname = "Tech Layers";
  static catergoryName = "Tech Catergory";
  static subGroupName = "Organizational Values";

  /**
   * Constructs a Catergory instance with specified category, group, and subcategory names.
   * @param {string} catergory - Main category name.
   * @param {string} subGroupName - Name of the sub-group.
   * @param {string} subCatergoryName - Name of the sub-category.
   */
  constructor(catergory, subGroupName, subCatergoryName) {
    this.catergory = catergory;
    this.subGroupName = subGroupName;
    this.subCatergoryName = subCatergoryName;
    this.extracts = [];  // Holds case entries (e.g., instances with a `description`)
  }

  /**
   * Find an existing extract/case by description.
   * @param {string} caseDescription - The description text to match.
   * @returns {object|null} - Matching extract if found, else null.
   */
  findExtract(caseDescription) {
    return this.extracts.find(entry => entry.description === caseDescription);
  }

  /**
   * Add a new extract/case to the list if it doesn't already exist.
   * @param {object} extractInstance - An object with a `description` property.
   */
  addExtract(extractInstance) {
    if (!this.findExtract(extractInstance.description)) {
      this.extracts.push(extractInstance);
    }
  }

  /**
   * Generate an HTML string representing a nested collapsible table row structure.
   * Each level (category → group → subcategory → extracts) is collapsible.
   * @returns {string} - HTML table row string.
   */
  toTableRow() {
    // Generate unique element IDs using category name
    const wrapperId = `wrapper_${this.catergory.replace(/\s+/g, '_')}`;
    const subGroupId = `${wrapperId}_subgroup`;
    const subCatergoryId = `${wrapperId}_subCatergory`;
    const extractBlockId = `${wrapperId}_extractBlock`;

    // Build nested HTML structure for the category
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

            <!-- Sub Group Section -->
            <tr class="collapsible" onclick="toggleRow('${subGroupId}')">
              <th colspan="2" class="subGroupHeading">
                <div class="headingLabel">${Catergory.catergoryName}</div>
                <div>${this.subGroupName}</div>
              </th>
            </tr>
            <tr id="${subGroupId}" style="display:none;">
              <td colspan="2" style="padding-left: 20px;">
                <table border="1" width="90%">

                  <!-- Sub Category Section -->
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

                  <!-- Extracts (Cases) Section -->
                  <tr class="collapsible" onclick="toggleRow('${extractBlockId}')">
                    <th colspan="2" class="caseHeading">
                      <div>${Catergory.extractname}</div>
                    </th>
                  </tr>
                  <tr id="${extractBlockId}" style="display:none;">
                    <td colspan="2">
                      <table border="1" width="100%">`;

    // Insert each extract case as a row
    this.extracts.forEach((extractItem, index) => {
      tableRow += `
                        <tr>
                          <td>${index + 1}. ${extractItem.description}</td>
                        </tr>`;
    });

    // Close all nested tables
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

  /**
   * Convert the Catergory instance to a readable string.
   * @returns {string} - Description of the category, subcategory, and extracts.
   */
  toString() {
    return `Catergory: ${this.catergory}, Sub Catergory: ${this.subCatergoryName}, Extracts: ${this.extracts.map(c => c.toString()).join(', ')}`;
  }
}
