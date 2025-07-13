document.addEventListener("DOMContentLoaded", () => {
  // Check for a global showSlide() function before calling it
  if (typeof window.showSlide === "function") {
    window.showSlide(0);
  }

  // Enable swipe gesture navigation if carousel exists
  const threshold = 50;        // Minimum swipe distance to trigger slide
  const minSwipeDistance = 10; // Ignore tiny accidental swipes
  let startX = 0;
  let endX = 0;

  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    // Track the start of the swipe
    carouselContainer.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      endX = startX;
    });

    // Update the swipe endpoint
    carouselContainer.addEventListener('touchmove', e => {
      endX = e.touches[0].clientX;
    });

    // Trigger next/prev slide if swipe distance is significant
    carouselContainer.addEventListener('touchend', () => {
      const diff = startX - endX;
      if (Math.abs(diff) > threshold && Math.abs(diff) > minSwipeDistance) {
        if (typeof nextSlide === "function" && typeof prevSlide === "function") {
          diff > 0 ? nextSlide() : prevSlide();
        }
      }
      startX = endX = 0;
    });
  }

  // Enable dot navigation if showSlide exists
  if (typeof window.showSlide === "function") {
    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });
  }

  // Fullscreen image modal for carousel images
  document.querySelectorAll('.carousel-image img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation(); // Prevent background click from closing modal immediately
      if (typeof openFullScreen === "function") {
        openFullScreen(img);
      }
    });
  });

  // Close the fullscreen modal on background or close button click
  const modal = document.getElementById("imgModal");
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal || e.target.classList.contains("close")) {
        if (typeof closeFullScreen === "function") {
          closeFullScreen();
        }
      }
    });
  }
});
