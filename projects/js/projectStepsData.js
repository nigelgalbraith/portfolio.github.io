// Function to generate and insert step content into the page
function loadProjectSteps(containerSelector, steps) {
  const container = document.querySelector(containerSelector);
  if (!container || !steps || steps.length === 0) return;

  // Loop through each step and build the corresponding HTML structure
  steps.forEach(({ title, img, alt, text }) => {
    // Create outer container for each step
    const box = document.createElement("div");
    box.className = "boxed-content";

    // Step title as a centered heading
    const h2 = document.createElement("h2");
    h2.className = "centered-title";
    h2.textContent = title;

    // Wrapper for zoomable image
    const wrapper = document.createElement("div");
    wrapper.className = "image-zoom-wrapper";

    // Placeholder div used by responsiveImageLoader to insert picture tags
    const imgDiv = document.createElement("div");
    imgDiv.className = "responsive-image";
    imgDiv.dataset.imgName = img;
    imgDiv.dataset.alt = alt;
    imgDiv.dataset.class = "centre-img"; // Styling class for centering

    wrapper.appendChild(imgDiv);

    // Text explanation for the step
    const p = document.createElement("p");
    p.textContent = text;

    // Assemble all parts and append to the main container
    box.appendChild(h2);
    box.appendChild(wrapper);
    box.appendChild(p);
    container.appendChild(box);

    // Optional line break between steps for spacing
    container.appendChild(document.createElement("br"));
  });
}

// Automatically run once the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Find the section in the page to inject content into
  const container = document.querySelector(".main-content-step-text section");

  // Identify the project type from the <body> data attribute
  const project = document.body.dataset.project;

  // Only proceed if matching project steps exist in ProjectSteps JSON
  if (container && ProjectSteps[project]) {
    loadProjectSteps(".main-content-step-text section", ProjectSteps[project]);
  }
});;
