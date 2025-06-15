// === Zoom for Single or Carousel Image ===
function openFullScreen() {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("fullImg");

  const singleImg = document.getElementById("zoomImage");
  const carouselImgs = document.querySelectorAll(".carousel-image");

  if (singleImg) {
    modalImg.src = singleImg.src;
  } else if (carouselImgs.length > 0) {
    modalImg.src = carouselImgs[currentSlide].src;
  }

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
  const slides = document.querySelectorAll(".carousel-image");
  const dots = document.querySelectorAll(".dot");

  if (slides.length === 0) return;

  // Wrap around if index is out of bounds
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;

  slides.forEach((slide, i) => {
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

  // Swipe support
  let startX = 0;
  let endX = 0;
  const threshold = 50; // minimum swipe distance in px

  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener('touchend', () => {
      if (startX - endX > threshold) {
        // swiped left
        nextSlide();
      } else if (endX - startX > threshold) {
        // swiped right
        prevSlide();
      }
      startX = 0;
      endX = 0;
    });
  }

  // Dot click event support (syncs dot click with currentSlide)
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index); // keeps currentSlide in sync
    });
  });
});
