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
}

function zoomCurrentImage() {
  openFullScreen();
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  showSlide(0);
});
