document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  if (!footer) return;

  // Clear existing content (optional if you want to overwrite)
  footer.innerHTML = "";

  // Create and append copyright
  const copyright = document.createElement("span");
  copyright.textContent = "© 2025 Nigel Galbraith";
  footer.appendChild(copyright);

  // Spacer between text and icons
  footer.append(" | ");

  // Icon details
  const iconList = [
    {
      href: "mailto:nigel.galbraith@proton.me",
      alt: "Email",
      src: "images/icons/optimized/email.png",
    },
    {
      href: "https://github.com/oldschool299792458/nigelgalbraith.github.io",
      alt: "GitHub",
      src: "images/icons/optimized/github.png",
    },
    {
      href: "https://linkedin.com/in/nigelgalbraith",
      alt: "LinkedIn",
      src: "images/icons/optimized/linkedin.png",
    },
  ];

  // Append each icon link
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
