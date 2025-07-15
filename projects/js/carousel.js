// js/carousel.js

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carousel) => {
    const carouselKey = carousel.dataset.carousel;
    const slideTrack = carousel.querySelector(".carousel-slide");
    const dotContainer = carousel.querySelector(".dots");

    let current = 0;
    const pictures = [];

    // Pull the image data from CAROUSEL_DATA (now defined in external JS file)
    const images = CAROUSEL_DATA[carouselKey] || [];

    // Build placeholders
    slideTrack.innerHTML = "";
    images.forEach((img) => {
      const placeholder = document.createElement("div");
      placeholder.className = "responsive-carousel-image";
      placeholder.dataset.imgName = img.imgName;
      placeholder.dataset.alt = img.alt || "";
      placeholder.dataset.class = img.class || "";
      slideTrack.appendChild(placeholder);
    });

    // Create arrow + dot controls
    const controlContainer = document.createElement("div");
    controlContainer.className = "carousel-controls";

    const leftArrow = document.createElement("button");
    leftArrow.className = "carousel-arrow left-arrow";
    leftArrow.innerHTML = "&lt;";

    const rightArrow = document.createElement("button");
    rightArrow.className = "carousel-arrow right-arrow";
    rightArrow.innerHTML = "&gt;";

    controlContainer.appendChild(leftArrow);

    const dots = images.map((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (i === 0) dot.classList.add("active");
      controlContainer.appendChild(dot);
      return dot;
    });

    controlContainer.appendChild(rightArrow);
    dotContainer.innerHTML = "";
    dotContainer.appendChild(controlContainer);

    const responsiveImages = slideTrack.querySelectorAll(".responsive-carousel-image");

    responsiveImages.forEach((element, index) => {
      const imgName = element.dataset.imgName;
      const alt = element.dataset.alt || "";
      const extraClass = element.dataset.class || "";

      const picture = document.createElement("picture");
      picture.className = "carousel-image";
      if (index === 0) picture.classList.add("active");

      picture.innerHTML = `
        <source media="(min-width: 1280px)" srcset="images/main/optimized/desktop/standard/${imgName}" />
        <source media="(min-width: 1024px)" srcset="images/main/optimized/laptop/standard/${imgName}" />
        <source media="(min-width: 480px)" srcset="images/main/optimized/mobile/standard/${imgName}" />
        <img 
          src="images/main/optimized/mobile/standard/${imgName}" 
          alt="${alt}" 
          class="${extraClass}" 
          data-full="images/main/optimized/desktop/zoom/${imgName}" 
        />
      `;

      const img = picture.querySelector("img");
      if (img && typeof openFullScreen === "function") {
        img.addEventListener("click", () => openFullScreen(img));
      }

      pictures.push(picture);
      element.replaceWith(picture);
    });

    function showSlide(index) {
      if (pictures.length === 0) return;
      current = ((index % pictures.length) + pictures.length) % pictures.length;

      pictures.forEach((slide, i) => {
        slide.classList.toggle("active", i === current);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }

    leftArrow.addEventListener("click", () => showSlide(current - 1));
    rightArrow.addEventListener("click", () => showSlide(current + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    let startX = 0;
    slideTrack.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    slideTrack.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        diff < 0 ? showSlide(current + 1) : showSlide(current - 1);
      }
    });

    showSlide(0);
  });
});
