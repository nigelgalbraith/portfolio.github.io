// At top of main.js (to be safe, declare globally)
window.toggleRow = function(id) {
  const element = document.getElementById(id);
  if (!element) return; // Defensive check
  element.style.display = (element.style.display === "none" || element.style.display === "") ? "table-row" : "none";
};

window.collapseAll = function() {
  const collapsibleSections = document.querySelectorAll('[id$="_details"], [id$="_group"], [id$="_subGroup"], [id$="_subCatergory"], [id$="_extractBlock"]');
  collapsibleSections.forEach(section => {
    section.style.display = "none";
  });
};

window.expandAll = function() {
  const collapsibleSections = document.querySelectorAll('[id$="_details"], [id$="_group"], [id$="_subGroup"], [id$="_subCatergory"], [id$="_extractBlock"]');
  collapsibleSections.forEach(section => {
    section.style.display = "table-row";
  });
};

window.main = function() {
  theSearchTool = Controller.setup(jsonData);
  theSearchTool.populateFactorDropdown();
  document.getElementById("FactorSelect").selectedIndex = -1;
};

window.onload = window.main;

// Global variable
window.theSearchTool = null;
