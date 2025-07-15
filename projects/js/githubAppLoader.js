// js/githubAppLoader.js
// Dynamically injects GitHub-hosted app links and metadata into HTML using GITHUB_APPS from external file.

document.addEventListener("DOMContentLoaded", () => {
  // Ensure GITHUB_APPS is loaded
  if (typeof GITHUB_APPS !== "object") return;

  document.querySelectorAll("[data-github-app]").forEach(container => {
    const key = container.dataset.githubApp;
    const app = GITHUB_APPS[key];

    if (!app) return;

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
