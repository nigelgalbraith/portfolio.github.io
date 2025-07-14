// Project-specific link data
const ProjectLinks = {
  thematic: [
    {
      label: "Main Thematic Webpage",
      href: "files/ThematicAnalysis/ThematicAnalysis-Web/Index.html",
      icon: "../images/icons/optimized/Webpage.PNG",
      alt: "Webpage Icon",
      target: "_blank"
    },
    {
      label: "Search Tool Page",
      href: "files/ThematicAnalysis/SearchTool-Web/Index.html",
      icon: "../images/icons/optimized/search.png",
      alt: "Web Search Icon",
      target: "_blank"
    },
    {
      label: "Download Project",
      href: "files/ThematicAnalysis.zip",
      icon: "../images/icons/optimized/zip.png",
      alt: "Download Icon",
      download: true
    }
  ],

  quiz: [
    {
      label: "Quiz Web App",
      href: "files/QuizCreator/Quiz-Web/Index.html",
      icon: "../images/icons/optimized/Webpage.PNG",
      alt: "Quiz Webpage Icon",
      target: "_blank"
    },
    {
      label: "Download Quiz Project",
      href: "files/QuizCreator.zip",
      icon: "../images/icons/optimized/zip.png",
      alt: "Download Quiz Icon",
      download: true
    }
  ],

  portfolio: [
    {
      label: "Download Website Tools",
      href: "files/PortfolioWebsiteTools.zip",
      icon: "../images/icons/optimized/zip.png",
      alt: "Zip",
      download: true
    }
  ]
};

// Injects the appropriate icon links into the container
function loadProjectLinks(divSelectorOrElement) {
  const container =
    typeof divSelectorOrElement === "string"
      ? document.querySelector(divSelectorOrElement)
      : divSelectorOrElement;

  if (!container) return;

  const key = container.dataset.links;
  const links = ProjectLinks[key];
  if (!Array.isArray(links) || links.length === 0) return;

  // Create icon grid
  const grid = document.createElement("div");
  grid.className = "icon-grid";

  // Build each link
  links.forEach(({ label, href, icon, alt, target, download }) => {
    const a = document.createElement("a");
    a.className = "grouped-list-item-button-link";
    a.href = href;
    if (target) a.target = target;
    if (download) a.setAttribute("download", "");

    const iconItem = document.createElement("div");
    iconItem.className = "icon-item";

    const img = document.createElement("img");
    img.className = "li-icon";
    img.src = icon;
    img.alt = alt;

    const span = document.createElement("span");
    span.textContent = label;

    iconItem.appendChild(img);
    iconItem.appendChild(span);
    a.appendChild(iconItem);
    grid.appendChild(a);
  });

  container.appendChild(grid);
}

// Run after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-links]').forEach(loadProjectLinks);
});
