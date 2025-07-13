// Opens the fullscreen image modal using either a direct image element
// or the currently active image in a carousel (if no element is passed)
function openFullScreen(imgElement) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("fullImg");

  let src = "";

  if (imgElement) {
    // Use high-resolution source if available, fallback to displayed src
    src = imgElement.dataset.full || imgElement.src;
  } else {
    // Fallback for carousels: find the active image in the carousel
    const carouselImgs = document.querySelectorAll(".carousel-image img");
    const activePicture = Array.from(carouselImgs).find(p =>
      p.closest("picture")?.classList.contains("active")
    );
    if (activePicture) {
      src = activePicture.dataset.full || activePicture.src;
    }
  }

  // Set modal image and display the modal
  modalImg.src = src;
  modalImg.alt = imgElement?.alt || "";
  modal.style.display = "block";
}

// Closes the fullscreen image modal and clears the image source
function closeFullScreen() {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("fullImg");

  modalImg.src = "";
  modal.style.display = "none";
}
