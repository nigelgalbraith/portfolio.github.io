let currentSlide = 0;

function showSlide(index) {
  const pictures = document.querySelectorAll(".carousel-image");
  const dots = document.querySelectorAll(".dot");

  if (pictures.length === 0) return;

  if (index < 0) index = pictures.length - 1;
  if (index >= pictures.length) index = 0;

  pictures.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  currentSlide = index;
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

// Inject responsive <picture> tags into .responsive-carousel-image containers
document.addEventListener("DOMContentLoaded", () => {
  const responsiveImages = document.querySelectorAll(".responsive-carousel-image");

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

    // Bind zoom functionality
    const img = picture.querySelector("img");
    if (img) {
      img.addEventListener("click", () => {
        openFullScreen(img);
      });
    }

    element.replaceWith(picture);
  });

  // Ensure the correct slide is shown after images are injected
  showSlide(currentSlide);
});
