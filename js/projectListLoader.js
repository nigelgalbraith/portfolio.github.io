// js/projectListLoader.js

document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
      href: "projects/kvm-lab.html",
      img: "images/thumbs/optimized/kvm-lab-thumb.png",
      alt: "KVM Virtual Lab thumbnail",
      title: "Open-Source Ubuntu KVM Solution",
      description: "My Ara capstone focused on replacing VMware Workstation Pro with an open-source Ubuntu KVM solution to improve resource flexibility and reduce licensing costs."
    },
    {
      href: "projects/sharepoint-gps.html",
      img: "images/thumbs/optimized/sharepoint-gps-thumb.png",
      alt: "SharePoint and GPS App thumbnail",
      title: "SharePoint Database and GPS-Based Tracking System",
      description: "Designed a SharePoint database and GPS-based tracking system to improve real-time traffic management planning and resource allocation at Downer."
    },
    {
      href: "projects/arcade-cabinet.html",
      img: "images/thumbs/optimized/arcade.png",
      alt: "DIY Projects thumbnail",
      title: "Custom Arcade Cabinet",
      description: "Built a fully functional arcade cabinet running a MAME emulator, complete with custom wiring, joystick/button setup, and retro-style cabinet design for an authentic gaming experience."
    },
    {
      href: "projects/QuizCreator.html",
      img: "images/thumbs/optimized/Quiz.png",
      alt: "Quiz Thumbnail",
      title: "Quiz Creator",
      description: "Create and run quizzes from Excel-based questions with explanations."
    },
    {
      href: "projects/ThermaticAnalysis.html",
      img: "images/thumbs/optimized/ThermaticAnalysis.png",
      alt: "ThermaticAnalysis Thumbnail",
      title: "Thermatic Analysis Web Tool",
      description: "Conduct a thermatic analysis in excell and use python to export it to browser for analysis"
    },
    {
      href: "projects/TerraceGardens.html",
      img: "images/thumbs/optimized/TerraceGardens.png",
      alt: "TerraceGardens Thumbnail",
      title: "Terrace Gardens",
      description: "Terrace gardens designed using SketchUp 3D software and constructed to bring modern green spaces to elevated environments."
    }
  ];

  const projectListContainer = document.querySelector(".grouped-list");

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
