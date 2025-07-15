// js/skillsLoader.js

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Ensure ICON_REGISTRY is available (defined in iconRegistry.js)
  if (typeof ICON_REGISTRY === "undefined") {
    console.error("ICON_REGISTRY is not defined. Make sure iconRegistry.js is loaded first.");
    return;
  }

  // Find all elements with the data-icons attribute
  document.querySelectorAll("[data-icons]").forEach(container => {
    const rawData = container.dataset.icons;
    if (!rawData) return;

    let iconKeys;

    // Handle wildcard for all icons or split comma-separated keys
    if (rawData.trim() === "*") {
      iconKeys = Object.keys(ICON_REGISTRY);
    } else {
      iconKeys = rawData.split(",").map(k => k.trim());
    }

    // Filter valid keys and sort alphabetically by label
    iconKeys = iconKeys
      .filter(key => ICON_REGISTRY[key])
      .sort((a, b) =>
        ICON_REGISTRY[a].label.toLowerCase().localeCompare(ICON_REGISTRY[b].label.toLowerCase())
      );

    // For each valid icon key, build the icon block and add it to the container
    iconKeys.forEach(key => {
      const icon = ICON_REGISTRY[key];

      const item = document.createElement("div");
      item.className = "icon-item";

      const img = document.createElement("img");
      img.className = "li-icon";
      img.src = icon.src;
      img.alt = icon.alt;

      const span = document.createElement("span");
      span.textContent = icon.label;

      item.appendChild(img);
      item.appendChild(span);
      container.appendChild(item);
    });
  });
});
