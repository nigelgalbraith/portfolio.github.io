function openFullScreen(imgElement) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("fullImg");

  let src = "";

  if (imgElement) {
    src = imgElement.dataset.full || imgElement.src;
  } else {
    const carouselImgs = document.querySelectorAll(".carousel-image img");
    const activePicture = Array.from(carouselImgs).find(p =>
      p.closest("picture")?.classList.contains("active")
    );
    if (activePicture) {
      src = activePicture.dataset.full || activePicture.src;
    }
  }

  modalImg.src = src;
  modalImg.alt = imgElement?.alt || "";
  modal.style.display = "block";
}

function closeFullScreen() {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("fullImg");

  modalImg.src = "";
  modal.style.display = "none";
}
