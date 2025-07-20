/**
 * Displays the extract modal by removing the 'hidden' class.
 * @param {string} modalId - The ID of the modal element to show.
 * @param {string} contentId - The ID of the modal content (unused here, may be used for future logic).
 */
function showExtractModal(modalId, contentId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('hidden');
}

/**
 * Hides the extract modal by adding the 'hidden' class.
 * @param {string} modalId - The ID of the modal element to hide.
 */
function hideExtractModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('hidden');
}

/**
 * Main function to generate the extracts table when the page loads.
 * It sets up the data, builds an HTML table with rows generated from
 * each Extract object, and inserts it into the DOM.
 */
function main() {
  // Setup data from JSON using the Controller
  const webAnalysis = Controller.setup(jsonDataThematic);

  // Get the container element where the table will be rendered
  const container = document.getElementById('extracts-container');

  // Start building the HTML for the table
  let html = `
    <table class="styled-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ref</th>
          <th>Extract</th>
          <th>Facts</th>
          <th>Factors</th>
          <th>Groups</th>
          <th>Sub Group</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Append a row for each extract object
  webAnalysis.forEach(extract => {
    html += extract.toTableRow(); // Generates the full <tr> for each extract
  });

  // Close the table HTML
  html += `
      </tbody>
    </table>
  `;

  // Insert the table into the container
  container.innerHTML = html;
}

// Run the main function once the page has fully loaded
window.onload = main;
