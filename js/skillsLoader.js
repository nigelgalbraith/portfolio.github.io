document.addEventListener("DOMContentLoaded", () => {
  const ICON_REGISTRY = {
    degree: {
      alt: "Degree",
      label: "BICT",
      src: "images/icons/optimized/degree.png",
    },
    cert: {
      alt: "Certificate",
      label: "CCNA Certified",
      src: "images/icons/optimized/cert.png",
    },
    cloud: {
      alt: "Cloud",
      label: "Azure Fundamentals",
      src: "images/icons/optimized/cloud.png",
    },
    "problem-solving": {
      alt: "Problem Solving",
      label: "Problem Solving",
      src: "images/icons/optimized/problem-solving.png",
    },
    teamwork: {
      alt: "Teamwork",
      label: "Team Collaboration",
      src: "images/icons/optimized/teamwork.png",
    },
    woodwork: {
      alt: "Woodwork",
      label: "Joinery & Carpentry",
      src: "images/icons/optimized/woodwork.png",
    },
    tools: {
      alt: "Tools",
      label: "Power Tools & Safety",
      src: "images/icons/optimized/tools.png",
    },
    repair: {
      alt: "DIY",
      label: "Electronics & DIY Fixes",
      src: "images/icons/optimized/repair.png",
    },
    network: {
      alt: "Networking",
      label: "Network Setup",
      src: "images/icons/optimized/network.png",
    },
    linux: {
      alt: "Linux",
      label: "Linux & CLI Tools",
      src: "images/icons/optimized/linux.png",
    },
    virtual: {
      alt: "Virtualization",
      label: "Virtualization & KVM",
      src: "images/icons/optimized/virtual.png",
    },
    sharepoint: {
      alt: "SharePoint",
      label: "SharePoint",
      src: "images/icons/optimized/SharePoint.png",
    },
    office365: {
      alt: "Office 365",
      label: "Office 365",
      src: "images/icons/optimized/Office365.png",
    },
    gps_tracking: {
      alt: "GPS Tracking",
      label: "GPS Integration",
      src: "images/icons/optimized/gps_tracking.png",
    },
    user_experience: {
      alt: "User Experience",
      label: "User Experience Design",
      src: "images/icons/optimized/user_experience.png",
    },
  };

  function renderIconsFromData(container) {
    const iconKeys = container.dataset.icons?.split(",").map(key => key.trim());
    if (!iconKeys || iconKeys.length === 0) return;

    iconKeys.forEach(key => {
      const icon = ICON_REGISTRY[key];
      if (!icon) return;

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
  }

  document.querySelectorAll("[data-icons]").forEach(renderIconsFromData);
});
