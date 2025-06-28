// === Zoom for Single or Carousel Image ===
function openFullScreen(imgElement) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("fullImg");

  let src = "";

  if (imgElement && imgElement.src) {
    src = imgElement.src;
  } else {
    // fallback for carousel images
    const carouselImgs = document.querySelectorAll(".carousel-image img");
    const activePicture = Array.from(carouselImgs).find(p => p.closest('picture').classList.contains('active'));
    if (activePicture) {
      src = activePicture.src;
    }
  }

  // Swap "standard" for "zoom" if applicable
  if (src.includes("/standard/")) {
    src = src.replace("/standard/", "/zoom/");
  }

  modalImg.src = src;
  modal.style.display = "block";
}

function closeFullScreen() {
  document.getElementById("imgModal").style.display = "none";
}

// === Mobile Menu Toggle ===
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

// === Image Carousel Logic ===
let currentSlide = 0;

function showSlide(index) {
  const pictures = document.querySelectorAll(".carousel-image");
  const dots = document.querySelectorAll(".dot");

  if (pictures.length === 0) return;

  // Wrap around if index is out of bounds
  if (index < 0) index = pictures.length - 1;
  if (index >= pictures.length) index = 0;

  pictures.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  currentSlide = index;
  console.log("Current slide index:", currentSlide); // Debugging log
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function zoomCurrentImage() {
  openFullScreen();
}

// === Initialize on DOM load and add swipe + dot click support ===
document.addEventListener("DOMContentLoaded", () => {
  showSlide(0);

  let startX = 0;
  let endX = 0;
  const threshold = 50; // minimum swipe distance in px to trigger slide change
  const minSwipeDistance = 10;

  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      endX = startX;
    });

    carouselContainer.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', () => {
      const diff = startX - endX;
      if (Math.abs(diff) > threshold && Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startX = 0;
      endX = 0;
    });
  }

  // Dot click support
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  // Image click handler to open zoom modal and stop event bubbling
  document.querySelectorAll('.carousel-image img').forEach(img => {
    img.addEventListener('click', (event) => {
      event.stopPropagation();
      openFullScreen(img);
    });
  });

  // Close modal when clicking outside image or close button
  const modal = document.getElementById("imgModal");
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('close')) {
      closeFullScreen();
    }
  });
});
