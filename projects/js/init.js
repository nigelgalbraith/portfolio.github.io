document.addEventListener("DOMContentLoaded", () => {
  showSlide(0);

  const threshold = 50;
  const minSwipeDistance = 10;
  let startX = 0;
  let endX = 0;

  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      endX = startX;
    });

    carouselContainer.addEventListener('touchmove', e => {
      endX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', () => {
      const diff = startX - endX;
      if (Math.abs(diff) > threshold && Math.abs(diff) > minSwipeDistance) {
        diff > 0 ? nextSlide() : prevSlide();
      }
      startX = endX = 0;
    });
  }

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  document.querySelectorAll('.carousel-image img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      openFullScreen(img);
    });
  });

  const modal = document.getElementById("imgModal");
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.classList.contains("close")) {
      closeFullScreen();
    }
  });
});
