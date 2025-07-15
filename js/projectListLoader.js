// js/projectListLoader.js

document.addEventListener("DOMContentLoaded", () => {
  const projectListContainer = document.querySelector(".grouped-list");

  // Use external JSON data
  const projects = PROJECT_LIST_DATA;

  projects.sort((a, b) => a.title.localeCompare(b.title));

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
    projectListContainer.insertAdjacentHTML("beforeend", template);
  });
});
