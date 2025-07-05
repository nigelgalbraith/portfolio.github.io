document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.responsive-image').forEach(container => {
    const fileName = container.dataset.imgName;
    const altText = container.dataset.alt || "";
    const imgClass = container.dataset.class || "";

    if (!fileName) return;

    const baseName = fileName.split('.')[0];       
    const ext = fileName.split('.').pop();         

    const picture = document.createElement("picture");
    picture.className = "zoomable";
    picture.setAttribute("onclick", "openFullScreen(this.querySelector('img'))");

    const breakpoints = [
      { media: "(min-width: 1280px)", folder: "desktop" },
      { media: "(min-width: 1024px)", folder: "laptop" },
      { media: "(min-width: 480px)",  folder: "mobile" }
    ];

    breakpoints.forEach(bp => {
      const source = document.createElement("source");
      source.setAttribute("media", bp.media);
      source.setAttribute("srcset", `images/main/optimized/${bp.folder}/standard/${fileName}`);
      picture.appendChild(source);
    });

    const img = document.createElement("img");
    img.src = `images/main/optimized/desktop/standard/${fileName}`;
    img.alt = altText;
    img.className = imgClass;

    const screenWidth = Math.max(
      window.innerWidth || 0,
      document.documentElement.clientWidth || 0
    );

    let zoomFolder = "desktop";
    if (screenWidth < 768) {
      zoomFolder = "mobile";
    } else if (screenWidth < 1280) {
      zoomFolder = "laptop";
    }

    img.setAttribute("data-full", `images/main/optimized/${zoomFolder}/zoom/${fileName}`);
    img.addEventListener("click", () => openFullScreen(img));

    const preloadZoom = document.createElement("link");
    preloadZoom.rel = "preload";
    preloadZoom.as = "image";
    preloadZoom.href = `images/main/optimized/${zoomFolder}/zoom/${fileName}`;
    document.head.appendChild(preloadZoom);

    picture.appendChild(img);
    container.replaceWith(picture);
  });
});
