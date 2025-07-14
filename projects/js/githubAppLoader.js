// githubAppLoader.js
// Dynamically injects GitHub-hosted app links and metadata into HTML using a JSON-like object.

document.addEventListener("DOMContentLoaded", () => {
  // Configuration object containing all GitHub app metadata
  const APP_DATA = {
    pacman: {
      title: "Pacman",
      icon: "Pacman.png",
      playLink: "files/Arcade/Pacman/index.html",
      download: "files/Arcade/Pacman.zip",
      source: "https://github.com/attogram/pacman-lite"
    },
    galaga: {
      title: "Galaga",
      icon: "Galaga.png",
      playLink: "files/Arcade/Galaga/index.html",
      download: "files/Arcade/Galaga.zip",
      source: "https://github.com/gregfrazier/gakaga"
    }
    // Add more apps here as needed
  };

  // Find all elements on the page that request a GitHub app via data-github-app
  document.querySelectorAll("[data-github-app]").forEach(container => {
    const key = container.dataset.githubApp;
    const app = APP_DATA[key];

    if (!app) return; // Skip if key is not found in APP_DATA

    // Inject structured HTML for the GitHub app (play, download, source)
    container.innerHTML = `
      <h2 class="centered-title">${app.title}</h2>
      <div class="icon-grid">
        <a class="grouped-list-item-button-link" href="${app.playLink}" target="_blank">
          <div class="icon-item">
            <img alt="${app.title} Icon" class="li-icon" src="../images/icons/optimized/${app.icon}" />
            <span>Play ${app.title}</span>
          </div>
        </a>
        <a class="grouped-list-item-button-link" download href="${app.download}">
          <div class="icon-item">
            <img alt="Download Icon" class="li-icon" src="../images/icons/optimized/zip.png" />
            <span>Download ${app.title}</span>
          </div>
        </a>
        <a class="grouped-list-item-button-link" href="${app.source}" target="_blank">
          <div class="icon-item">
            <img alt="GitHub Icon" class="li-icon" src="../images/icons/optimized/githubBlack.png" />
            <span>${app.title} Source</span>
          </div>
        </a>
      </div>
    `;
  });
});
