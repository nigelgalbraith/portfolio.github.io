function showExtractModal(modalId, contentId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('hidden');
}

function hideExtractModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('hidden');
}

function main() {
  const webAnalysis = Controller.setup(jsonDataThematic);
  const container = document.getElementById('extracts-container');

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

  webAnalysis.forEach(extract => {
    html += extract.toTableRow();
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

window.onload = main;
