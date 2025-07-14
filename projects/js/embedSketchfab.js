const SKETCHFAB_MODELS = {
  terraceGardens: {
    title: "Terrace Gardens",
    embedUrl: "https://sketchfab.com/models/f8835a039ccd44e09f831213514e628c/embed",
    directLink: "https://sketchfab.com/3d-models/terrace-gardens-f8835a039ccd44e09f831213514e628c",
    username: "nigelgalbraith",
    userProfile: "https://sketchfab.com/Oldschool299792458",
    links: [
      {
        href: "https://sketchfab.com/3d-models/terrace-gardens-f8835a039ccd44e09f831213514e628c",
        icon: "../images/icons/optimized/SketchFabIcon.png",
        label: "View Model",
        download: false
      },
      {
        href: "files/Models/Stair_Garden_Boxes.zip",
        icon: "../images/icons/optimized/zip.png",
        label: "Download Model",
        download: true
      }
    ]
  },
  greenhouseBoxes: {
    title: "Greenhouse Planter Boxes - Capping",
    embedUrl: "https://sketchfab.com/models/04bd290ad70d402a8e07a7ce4ddbeacb/embed",
    directLink: "https://sketchfab.com/3d-models/greenhouse-planter-boxes-capping-04bd290ad70d402a8e07a7ce4ddbeacb",
    username: "nigelgalbraith",
    userProfile: "https://sketchfab.com/Oldschool299792458",
    links: [
      {
        href: "https://sketchfab.com/3d-models/greenhouse-planter-boxes-capping-04bd290ad70d402a8e07a7ce4ddbeacb",
        icon: "../images/icons/optimized/SketchFabIcon.png",
        label: "View Model",
        download: false
      },
      {
        href: "files/Models/Planter_Boxes.zip",
        icon: "../images/icons/optimized/zip.png",
        label: "Download Model",
        download: true
      }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Inject Sketchfab iframe embed where [data-sketchfab-embed] is used
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

  // Inject model download/view links where [data-sketchfab-links] is used
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
