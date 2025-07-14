// Define all carousel image data in one place
const CAROUSEL_DATA = {
  arcadeCarousel: [
    { imgName: "Arcade-Cabinet1.png", alt: "Arcade Cabinet 1", class: "centre-img" },
    { imgName: "Arcade-Cabinet2.png", alt: "Arcade Cabinet 2", class: "centre-img" }
  ],
    terraceGardensCarousel: [
    { imgName: "TerraceGardens1.png", alt: "Terrace Gardens 1", class: "centre-img" },
    { imgName: "TerraceGardens2.png", alt: "Terrace Gardens 2", class: "centre-img" },
    { imgName: "TerraceGardens3.png", alt: "Terrace Gardens 3", class: "centre-img" },
    { imgName: "TerraceGardens4.png", alt: "Terrace Gardens 4", class: "centre-img" },
    { imgName: "TerraceGardens5.png", alt: "Terrace Gardens 5", class: "centre-img" },
    { imgName: "TerraceGardens6.png", alt: "Terrace Gardens 6", class: "centre-img" }
  ],
  terraceSketchupCarousel: [
    { imgName: "TerraceGardensSketchUp1.png", alt: "Terrace Gardens SketchUp 1", class: "centre-img" },
    { imgName: "TerraceGardensSketchUp2.png", alt: "Terrace Gardens SketchUp 2", class: "centre-img" },
    { imgName: "TerraceGardensSketchUp3.png", alt: "Terrace Gardens SketchUp 3", class: "centre-img" },
    { imgName: "TerraceGardensSketchUp4.png", alt: "Terrace Gardens SketchUp 4", class: "centre-img" }
  ],
  greenhouseCarousel: [
    { imgName: "GreenhousePlanterBox1.png", alt: "Greenhouse Planter Box 1", class: "centre-img" },
    { imgName: "GreenhousePlanterBox2.png", alt: "Greenhouse Planter Box 2", class: "centre-img" },
    { imgName: "GreenhousePlanterBox3.png", alt: "Greenhouse Planter Box 3", class: "centre-img" }
  ],
  greenhouseSketchupCarousel: [
    { imgName: "GreenhousePlanterBoxesSketchUp1.png", alt: "Greenhouse Planter Boxes SketchUp 1", class: "centre-img" },
    { imgName: "GreenhousePlanterBoxesSketchUp2.png", alt: "Greenhouse Planter Boxes SketchUp 2", class: "centre-img" },
    { imgName: "GreenhousePlanterBoxesSketchUp3.png", alt: "Greenhouse Planter Boxes SketchUp 3", class: "centre-img" },
    { imgName: "GreenhousePlanterBoxesSketchUp4.png", alt: "Greenhouse Planter Boxes SketchUp 4", class: "centre-img" }
  ]
  // Add more carousels here if needed
};

document.addEventListener("DOMContentLoaded", () => {
  // Find all carousels on the page
  const carousels = document.querySelectorAll(".carousel-container");

  // Loop through each carousel separately
  carousels.forEach((carousel, carouselIndex) => {
    const carouselKey = carousel.dataset.carousel;     // Get carousel ID
    const slideTrack = carousel.querySelector(".carousel-slide");
    const dotContainer = carousel.querySelector(".dots");

    let current = 0;                // Tracks the current slide index
    const pictures = [];           // Stores the <picture> elements for this carousel

    // Clear slide track and inject image placeholders from CAROUSEL_DATA
    slideTrack.innerHTML = "";
    const images = CAROUSEL_DATA[carouselKey] || [];

    images.forEach((img) => {
      const placeholder = document.createElement("div");
      placeholder.className = "responsive-carousel-image";
      placeholder.dataset.imgName = img.imgName;
      placeholder.dataset.alt = img.alt || "";
      placeholder.dataset.class = img.class || "";
      slideTrack.appendChild(placeholder);
    });

    // Inject dot controls dynamically based on image count
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
    dotContainer.innerHTML = ""; // Clear any previous content
    dotContainer.appendChild(controlContainer);

    // Convert placeholder divs into actual <picture> elements with responsive <source> tags
    const responsiveImages = slideTrack.querySelectorAll(".responsive-carousel-image");

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
        img.addEventListener("click", () => {
          if (typeof openFullScreen === "function") {
            openFullScreen(img);
          }
        });
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
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }

    // Move to previous slide
    const prevSlide = () => showSlide(current - 1);

    // Move to next slide
    const nextSlide = () => showSlide(current + 1);

    // Arrow button navigation
    leftArrow?.addEventListener("click", prevSlide);
    rightArrow?.addEventListener("click", nextSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
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
