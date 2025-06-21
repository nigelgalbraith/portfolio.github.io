// Global variable to store the search tool instance
window.theSearchTool = null;

// Function to toggle the menus
window.toggleRow = function(id) {
    const element = document.getElementById(elementId);
    if (element.style.display === "none" || element.style.display === "") {
        element.style.display = "table-row";
    } else {
        element.style.display = "none";
    }
};

// Expand & Collapse Buttons
window.collapseAll = function() {
    const collapsibleSections = document.querySelectorAll(
        '[id$="_details"], [id$="_group"], [id$="_subGroup"], [id$="_subCatergory"], [id$="_extractBlock"]'
    );
    collapsibleSections.forEach(section => {
        section.style.display = "none";
    });
};

window.expandAll = function() {
    const collapsibleSections = document.querySelectorAll(
        '[id$="_details"], [id$="_group"], [id$="_subGroup"], [id$="_subCatergory"], [id$="_extractBlock"]'
    );
    collapsibleSections.forEach(section => {
        section.style.display = "table-row";
    });
};

// Function to update the table based on the selected factor
window.updateTable = function() {
    if (window.theSearchTool) {
        window.theSearchTool.updateTable();
    }
};

// Main function to initialize the search tool and populate the dropdown
window.main = function() {
    window.theSearchTool = Controller.setup(jsonData);
    console.log(window.theSearchTool);
    
    // Log the structure for debugging
    window.theSearchTool.factors.forEach(factor => {
        console.log(factor.toString());
        factor.groups.forEach(group => {
            console.log(group.toString());
            group.wrappers.forEach(catergory => {
                console.log(catergory.toString());
                catergory.extracts.forEach(extractInstance => {
                    console.log(extractInstance.toString());
                });
            });
        });
    });

    // Populate the dropdown and update the table
    window.theSearchTool.populateFactorDropdown();

    // Set the selectedIndex to -1 to start with no selected option displayed
    document.getElementById("FactorSelect").selectedIndex = -1;
};

// Initialize when window loads
window.onload = window.main;