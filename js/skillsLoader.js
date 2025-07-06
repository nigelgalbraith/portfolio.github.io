document.addEventListener("DOMContentLoaded", () => {
  //  Dynamically detect if current page is in a subdirectory
  const ICON_PATH_PREFIX = window.location.pathname.includes("/projects/") ? "../" : "";

  //  ICON_REGISTRY using dynamic prefix
const ICON_REGISTRY = {
  degree:           { alt: "Degree",                  label: "BICT",                     src: ICON_PATH_PREFIX + "images/icons/optimized/degree.png" },
  cert:             { alt: "Certificate",             label: "CCNA Certified",           src: ICON_PATH_PREFIX + "images/icons/optimized/cert.png" },
  cloud:            { alt: "Cloud",                   label: "Azure Fundamentals",       src: ICON_PATH_PREFIX + "images/icons/optimized/cloud.png" },
  sharepoint:       { alt: "SharePoint",              label: "SharePoint",               src: ICON_PATH_PREFIX + "images/icons/optimized/SharePoint.png" },
  office365:        { alt: "Office 365",              label: "Office 365",               src: ICON_PATH_PREFIX + "images/icons/optimized/Office365.png" },
  ubuntu:           { alt: "Linux",                   label: "Ubuntu KVM",               src: ICON_PATH_PREFIX + "images/icons/optimized/linux.png" },
  linux:            { alt: "Linux",                   label: "Linux & CLI Tools",        src: ICON_PATH_PREFIX + "images/icons/optimized/linux.png" },
  libvirt:          { alt: "Networking",              label: "Libvirt",                  src: ICON_PATH_PREFIX + "images/icons/optimized/network.png" },
  network:          { alt: "Networking",              label: "Network Setup",            src: ICON_PATH_PREFIX + "images/icons/optimized/network.png" },
  qemu:             { alt: "Virtualization",          label: "QEMU",                     src: ICON_PATH_PREFIX + "images/icons/optimized/virtual.png" },
  virtual:          { alt: "Virtualization",          label: "Virtualization & KVM",     src: ICON_PATH_PREFIX + "images/icons/optimized/virtual.png" },
  shell:            { alt: "Shell Scripting",         label: "Shell Scripting",          src: ICON_PATH_PREFIX + "images/icons/optimized/programing.png" },
  python:           { alt: "Python",                  label: "Python",                   src: ICON_PATH_PREFIX + "images/icons/optimized/python.png" },
  permissions:      { alt: "Permissions",             label: "Permissions",              src: ICON_PATH_PREFIX + "images/icons/optimized/repair.png" },
  repair:           { alt: "DIY",                     label: "Electronics & DIY Fixes",  src: ICON_PATH_PREFIX + "images/icons/optimized/repair.png" },
  tools:            { alt: "Tools",                   label: "Power Tools & Safety",     src: ICON_PATH_PREFIX + "images/icons/optimized/tools.png" },
  woodwork:         { alt: "Woodwork",                label: "Joinery & Carpentry",      src: ICON_PATH_PREFIX + "images/icons/optimized/woodwork.png" },
  problem_solving:  { alt: "Problem Solving",         label: "Problem Solving",          src: ICON_PATH_PREFIX + "images/icons/optimized/problem-solving.png" },
  debugging:        { alt: "Debugging",               label: "Debugging",                src: ICON_PATH_PREFIX + "images/icons/optimized/problem-solving.png" },
  teamwork:         { alt: "Teamwork",                label: "Team Collaboration",       src: ICON_PATH_PREFIX + "images/icons/optimized/teamwork.png" },
  collaboration:    { alt: "Collaboration & Testing", label: "Collaboration & Testing",  src: ICON_PATH_PREFIX + "images/icons/optimized/teamwork.png" },
  automation:       { alt: "System Automation",       label: "System Automation",        src: ICON_PATH_PREFIX + "images/icons/optimized/linux.png" },
  security:         { alt: "Security Best Practices", label: "Security Best Practices",  src: ICON_PATH_PREFIX + "images/icons/optimized/degree.png" },
  gps_tracking:     { alt: "GPS Tracking",            label: "GPS Integration",          src: ICON_PATH_PREFIX + "images/icons/optimized/gps_tracking.png" },
  gps:              { alt: "GPS Integration",         label: "GPS Integration",          src: ICON_PATH_PREFIX + "images/icons/optimized/gps_tracking.png" },
  user_experience:  { alt: "User Experience",         label: "User Experience Design",   src: ICON_PATH_PREFIX + "images/icons/optimized/user_experience.png" },
  SketchUp:         { alt: "SketchUp",                label: "SketchUp",                 src: ICON_PATH_PREFIX + "images/icons/optimized/SketchUpIcon.png" },
  ThreeD_Design:    { alt: "3D Design",               label: "3D Design",                src: ICON_PATH_PREFIX + "images/icons/optimized/3D_Design.png" }
};


function renderIconsFromData(container) {
  const rawData = container.dataset.icons;
  let iconKeys;

  if (!rawData) return;

  // If wildcard, load all keys from the registry
  if (rawData.trim() === "*") {
    iconKeys = Object.keys(ICON_REGISTRY);
  } else {
    iconKeys = rawData.split(",").map(key => key.trim());
  }

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
