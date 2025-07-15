// js/embedSketchfab.js

document.addEventListener("DOMContentLoaded", () => {
  // Embed Sketchfab models in iframes
  document.querySelectorAll("[data-sketchfab-embed]").forEach(container => {
    const key = container.dataset.sketchfabEmbed;
    const model = SKETCHFAB_MODELS[key];
    if (!model) return;

    container.innerHTML = `
      <div class="sketchfab-embed-wrapper">
        <iframe title="${model.title}" 
                frameborder="0" 
                allowfullscreen 
                mozallowfullscreen="true" 
                webkitallowfullscreen="true" 
                allow="autoplay; fullscreen; xr-spatial-tracking" 
                xr-spatial-tracking 
                execution-while-out-of-viewport 
                execution-while-not-rendered 
                web-share 
                src="${model.embedUrl}" 
                style="width: 100%; height: 500px;">
        </iframe>
        <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
          <a href="${model.directLink}" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">${model.title}</a>
          by 
          <a href="${model.userProfile}" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">${model.username}</a>
          on 
          <a href="https://sketchfab.com" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a>
        </p>
      </div>
    `;
  });

  // Inject download/view links
  document.querySelectorAll("[data-sketchfab-links]").forEach(container => {
    const key = container.dataset.sketchfabLinks;
    const model = SKETCHFAB_MODELS[key];
    if (!model?.links?.length) return;

    let linksHTML = `
      <h2 class="centered-title">Model Links</h2>
      <div class="icon-grid">
    `;

    model.links.forEach(link => {
      linksHTML += `
        <a class="grouped-list-item-button-link" href="${link.href}" ${link.download ? "download" : 'target="_blank"'}>
          <div class="icon-item">
            <img alt="${link.label}" class="li-icon" src="${link.icon}" />
            <span>${link.label}</span>
          </div>
        </a>
      `;
    });

    linksHTML += `</div>`;
    container.innerHTML = linksHTML;
  });
});
