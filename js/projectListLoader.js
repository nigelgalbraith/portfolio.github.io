// js/projectListLoader.js

// Wait until the DOM is fully loaded before executing script
document.addEventListener("DOMContentLoaded", () => {

  // Array of project objects, each defining the link, thumbnail, alt text, title, and description
  const projects = [
    {
      href: "projects/arcade-cabinet.html",
      img: "images/thumbs/optimized/arcade.png",
      alt: "DIY Projects thumbnail",
      title: "Custom Arcade Cabinet",
      description: "Reused salvaged materials to build a full-sized MAME arcade cabinet with custom wiring and controls. Powered by an old Dell PC, it runs HyperSpin and emulates multiple retro consoles for a nostalgic, all-in-one gaming setup."
    },
    {
      href: "projects/GreenhousePlanterBox.html",
      img: "images/thumbs/optimized/GreenhousePlanterBox.png",
      alt: "GreenhousePlanterBox Thumbnail",
      title: "Greenhouse Planter Boxes",
      description: "Used SketchUp to plan and visualize custom planter box layouts for a greenhouse environment. Focused on efficient space usage, sustainable materials, and indoor growing conditions suited for year-round cultivation."
    },
    {
      href: "projects/kvm-lab.html",
      img: "images/thumbs/optimized/kvm-lab-thumb.png",
      alt: "KVM Virtual Lab thumbnail",
      title: "Open-Source Ubuntu KVM Solution",
      description: "A practical alternative to VMware built using Ubuntu, QEMU, and Libvirt. This project aimed to reduce licensing costs and improve control over virtual lab environments while integrating with existing domain infrastructure."
    },
    {
      href: "projects/PortfolioWebsite.html",
      img: "images/thumbs/optimized/PortfolioWebsite.png",
      alt: "Portfolio Website Thumbnail",
      title: "Portfolio Website",
      description: "This website was built from scratch using modular HTML and dynamic JavaScript injection. Each project page is templated with reusable loaders for clean, maintainable structure—no frameworks, just raw code."
    },
    {
      href: "projects/QuizCreator.html",
      img: "images/thumbs/optimized/Quiz.png",
      alt: "Quiz Thumbnail",
      title: "Quiz Creator",
      description: "A tool that reads quiz questions and answers from an Excel file and converts them into an interactive browser-based quiz. It runs locally and includes explanations for each answer, making it ideal for self-study and offline use."
    },
    {
      href: "projects/sharepoint-gps.html",
      img: "images/thumbs/optimized/sharepoint-gps-thumb.png",
      alt: "SharePoint and GPS App thumbnail",
      title: "SharePoint Database and GPS-Based Tracking System",
      description: "Developed a SharePoint platform and mobile-friendly workflow to help field staff access job data, upload site checks, and automatically log GPS positions of signage. Improved planning and coordination across traffic management teams."
    },
    {
      href: "projects/TerraceGardens.html",
      img: "images/thumbs/optimized/TerraceGardens.png",
      alt: "TerraceGardens Thumbnail",
      title: "Terrace Gardens",
      description: "Used SketchUp to plan and visualize tiered garden designs for narrow or sloped spaces. Focused on low-maintenance, sustainable planting layouts that could fit within tight urban environments or backyard terraces."
    },
    {
      href: "projects/ThermaticAnalysis.html",
      img: "images/thumbs/optimized/ThermaticAnalysis.png",
      alt: "ThermaticAnalysis Thumbnail",
      title: "Thermatic Analysis Web Tool",
      description: "Helps structure thematic analysis findings from Excel into a clean, interactive web interface. Uses Python to transform raw coding data into something easier to review, share, and discuss with others."
    }
  ];

  // Sort the project objects alphabetically by title
  projects.sort((a, b) => a.title.localeCompare(b.title));

  // Select the container element where project cards will be injected
  const projectListContainer = document.querySelector(".grouped-list");

  // Loop through each project and generate its HTML block, then append it to the container
  projects.forEach((project) => {
    const template = `
      <a class="grouped-list-item-button-link" href="${project.href}">
        <div class="grouped-list-item-button">
          <img alt="${project.alt}" src="${project.img}" />
          <div class="grouped-list-item-button-text">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
          </div>
        </div>
      </a>
    `;
    // Insert the generated HTML into the DOM as a child of the container
    projectListContainer.insertAdjacentHTML("beforeend", template);
  });
});
