function openFullScreen(imgElement) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("fullImg");

  let src = "";

  if (imgElement && imgElement.src) {
    src = imgElement.src;
  } else {
    const carouselImgs = document.querySelectorAll(".carousel-image img");
    const activePicture = Array.from(carouselImgs).find(p =>
      p.closest("picture").classList.contains("active")
    );
    if (activePicture) src = activePicture.src;
  }

  if (src.includes("/standard/")) {
    src = src.replace("/standard/", "/zoom/");
  }

  modalImg.src = src;
  modal.style.display = "block";
}

function closeFullScreen() {
  document.getElementById("imgModal").style.display = "none";
}
