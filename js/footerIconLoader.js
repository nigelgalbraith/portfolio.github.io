document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  if (!footer) return;

  // Determine path prefix based on current page location
  const isInProjectsFolder = window.location.pathname.includes("/projects/");
  const imagePathPrefix = isInProjectsFolder ? "../images" : "images";

  // Clear existing content (optional)
  footer.innerHTML = "";

  // Add copyright
  const copyright = document.createElement("span");
  copyright.textContent = "© 2025 Nigel Galbraith";
  footer.appendChild(copyright);

  // Separator
  footer.append(" | ");

  // Icons
  const iconList = [
    {
      href: "mailto:nigel.galbraith@proton.me",
      alt: "Email",
      src: `${imagePathPrefix}/icons/optimized/email.png`,
    },
    {
      href: "https://github.com/oldschool299792458/nigelgalbraith.github.io",
      alt: "GitHub",
      src: `${imagePathPrefix}/icons/optimized/github.png`,
    },
    {
      href: "https://linkedin.com/in/nigelgalbraith",
      alt: "LinkedIn",
      src: `${imagePathPrefix}/icons/optimized/linkedin.png`,
    },
  ];

  // Add icons
  iconList.forEach(({ href, alt, src }) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "footer-icon";

    a.appendChild(img);
    footer.appendChild(a);
  });
});
