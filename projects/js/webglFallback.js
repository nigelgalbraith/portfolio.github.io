function testModelViewer(callback) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';

  // Create a temporary sandbox HTML with model-viewer
  const blob = new Blob([`
    <!DOCTYPE html>
    <html>
    <head>
      <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
    </head>
    <body>
      <model-viewer src="models/terrace_garden.glb" camera-controls></model-viewer>
    </body>
    </html>
  `], { type: 'text/html' });

  iframe.src = URL.createObjectURL(blob);

  // Set a timeout: if iframe fails to render in 1s, assume fail
  const failTimeout = setTimeout(() => {
    iframe.remove();
    callback(false);
  }, 1000);

  iframe.onload = () => {
    try {
      // If iframe has a WebGL context and model-viewer loads, pass
      const glCanvas = iframe.contentDocument.querySelector('canvas');
      if (glCanvas && glCanvas.getContext('webgl')) {
        clearTimeout(failTimeout);
        iframe.remove();
        callback(true);
      } else {
        throw new Error("No usable WebGL canvas found.");
      }
    } catch {
      clearTimeout(failTimeout);
      iframe.remove();
      callback(false);
    }
  };

  document.body.appendChild(iframe);
}

window.addEventListener('DOMContentLoaded', () => {
  const viewerContainer = document.getElementById('modelViewerContainer');
  const fallbackCarousel = document.getElementById('fallbackCarousel');

  if (!viewerContainer || !fallbackCarousel) {
    console.error("❌ Missing viewer or fallback container.");
    return;
  }

  testModelViewer((canUseModelViewer) => {
    if (canUseModelViewer) {
      console.log("✅ model-viewer works in this environment.");

      // Dynamically load model-viewer script for real
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.onload = () => {
        viewerContainer.innerHTML = `
          <model-viewer src="models/terrace_garden.glb"
                        alt="Terrace Garden 3D Model"
                        auto-rotate
                        camera-controls
                        style="width: 100%; height: 500px;">
          </model-viewer>
        `;
        viewerContainer.style.display = 'block';
        fallbackCarousel.style.display = 'none';
      };
      document.head.appendChild(script);
    } else {
    console.warn("⚠️ model-viewer is broken in this environment. Showing fallback.");
    viewerContainer.style.display = 'none';
    fallbackCarousel.style.display = 'block';
    if (typeof showSlide === 'function') showSlide(0); 

    }
  });
});
