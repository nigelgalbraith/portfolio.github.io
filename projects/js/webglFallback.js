function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;

    // Try to use the context
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const isValid = gl.isTexture(tex);
    gl.deleteTexture(tex);
    return isValid;
  } catch {
    return false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const viewerContainer = document.getElementById('modelViewerContainer');
  const fallbackCarousel = document.getElementById('fallbackCarousel');

  if (!viewerContainer || !fallbackCarousel) {
    console.error("❌ Missing viewer or fallback container.");
    return;
  }

  if (webglAvailable()) {
    console.log("✅ WebGL is available. Loading <model-viewer>...");

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

    script.onerror = () => {
      console.warn("⚠️ model-viewer script failed to load. Showing fallback.");
      viewerContainer.style.display = 'none';
      fallbackCarousel.style.display = 'block';
      if (typeof showSlide === 'function') showSlide(0);
    };

    document.head.appendChild(script);
  } else {
    console.warn("⚠️ WebGL not available. Showing fallback carousel.");
    viewerContainer.style.display = 'none';
    fallbackCarousel.style.display = 'block';
    if (typeof showSlide === 'function') showSlide(0);
  }
});
