// js/projectLinksLoader.js
// Injects appropriate links using the global ProjectLinks object

function loadProjectLinks(divSelectorOrElement) {
  const container =
    typeof divSelectorOrElement === "string"
      ? document.querySelector(divSelectorOrElement)
      : divSelectorOrElement;

  if (!container) return;

  const key = container.dataset.links;
  const links = ProjectLinks[key];
  if (!Array.isArray(links) || links.length === 0) return;

  const grid = document.createElement("div");
  grid.className = "icon-grid";

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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-links]").forEach(loadProjectLinks);
});
