document.addEventListener("DOMContentLoaded", () => {
  // Find all carousels on the page
  const carousels = document.querySelectorAll(".carousel-container");

  // Loop through each carousel separately
  carousels.forEach((carousel, carouselIndex) => {
    const responsiveImages = carousel.querySelectorAll(".responsive-carousel-image");
    const slideTrack = carousel.querySelector(".carousel-slide");
    const dotElements = carousel.querySelectorAll(".dot");

    let current = 0;                // Tracks the current slide index
    const pictures = [];           // Stores the <picture> elements for this carousel

    // Convert placeholder divs into actual <picture> elements with responsive <source> tags
    responsiveImages.forEach((element, index) => {
      const imgName = element.dataset.imgName;
      const alt = element.dataset.alt || "";
      const extraClass = element.dataset.class || "";

      // Create a responsive <picture> tag
      const picture = document.createElement("picture");
      picture.className = "carousel-image";
      if (index === 0) picture.classList.add("active"); // Make the first one visible initially

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

      // Add fullscreen zoom on click (if modalZoom.js is included)
      const img = picture.querySelector("img");
      if (img) {
        img.addEventListener("click", () => openFullScreen(img));
      }

      pictures.push(picture);          // Add picture to the list of slides
      element.replaceWith(picture);    // Replace original placeholder with real picture
    });

    // Display a specific slide by index
    function showSlide(index) {
      if (pictures.length === 0) return;

      // Loop around if index goes out of bounds
      current = ((index % pictures.length) + pictures.length) % pictures.length;

      // Update active slide visibility
      pictures.forEach((slide, i) => {
        slide.classList.toggle("active", i === current);
      });

      // Update active dot indicator
      dotElements.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }

    // Move to previous slide
    const prevSlide = () => showSlide(current - 1);

    // Move to next slide
    const nextSlide = () => showSlide(current + 1);

    // Arrow button navigation
    carousel.querySelector(".left-arrow")?.addEventListener("click", prevSlide);
    carousel.querySelector(".right-arrow")?.addEventListener("click", nextSlide);

    // Dot navigation
    dotElements.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    // Mobile swipe gesture support
    let startX = 0;
    slideTrack?.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    slideTrack?.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        diff < 0 ? nextSlide() : prevSlide();
      }
    });

    // Show the first slide on load
    showSlide(0);
  });
});
