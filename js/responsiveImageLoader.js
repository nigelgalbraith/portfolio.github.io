document.addEventListener("DOMContentLoaded", () => {
  // Loop through all elements marked for responsive image replacement
  document.querySelectorAll('.responsive-image').forEach(container => {
    const fileName = container.dataset.imgName;
    const altText = container.dataset.alt || "";
    const imgClass = container.dataset.class || "";

    if (!fileName) return; // Skip if no image name is provided

    const baseName = fileName.split('.')[0];       // Get filename without extension
    const ext = fileName.split('.').pop();         // Get file extension

    // Create a <picture> element with a zoomable class and click handler
    const picture = document.createElement("picture");
    picture.className = "zoomable";
    picture.setAttribute("onclick", "openFullScreen(this.querySelector('img'))");

    // Define responsive image sources based on screen width
    const breakpoints = [
      { media: "(min-width: 1280px)", folder: "desktop" },
      { media: "(min-width: 1024px)", folder: "laptop" },
      { media: "(min-width: 480px)",  folder: "mobile" }
    ];

    // Create <source> elements for each responsive image size
    breakpoints.forEach(bp => {
      const source = document.createElement("source");
      source.setAttribute("media", bp.media);
      source.setAttribute("srcset", `images/main/optimized/${bp.folder}/standard/${fileName}`);
      picture.appendChild(source);
    });

    // Create the default <img> element
    const img = document.createElement("img");
    img.src = `images/main/optimized/desktop/standard/${fileName}`;
    img.alt = altText;
    img.className = imgClass;

    // Determine appropriate zoom image folder based on current screen width
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

    // Set zoom image path for full-screen viewing
    img.setAttribute("data-full", `images/main/optimized/${zoomFolder}/zoom/${fileName}`);
    img.addEventListener("click", () => openFullScreen(img));

    // Preload the zoomed version of the image for smoother experience
    const preloadZoom = document.createElement("link");
    preloadZoom.rel = "preload";
    preloadZoom.as = "image";
    preloadZoom.href = `images/main/optimized/${zoomFolder}/zoom/${fileName}`;
    document.head.appendChild(preloadZoom);

    // Final assembly: add image to <picture> and replace original container
    picture.appendChild(img);
    container.replaceWith(picture);
  });
});
