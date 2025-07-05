document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carousel) => {
    const responsiveImages = carousel.querySelectorAll(".responsive-carousel-image");
    const slideTrack = carousel.querySelector(".carousel-slide");
    const dots = carousel.querySelectorAll(".dot");

    let current = 0;
    const pictures = [];

    // Inject <picture> elements
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

      // Add zoom handler
      const img = picture.querySelector("img");
      if (img) {
        img.addEventListener("click", () => {
          openFullScreen(img);
        });
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

    // Add button listeners for this carousel only
    const leftBtn = carousel.querySelector(".left-arrow");
    const rightBtn = carousel.querySelector(".right-arrow");

    if (leftBtn) leftBtn.addEventListener("click", () => showSlide(current - 1));
    if (rightBtn) rightBtn.addEventListener("click", () => showSlide(current + 1));

    // Init first slide
    showSlide(0);
  });
});
