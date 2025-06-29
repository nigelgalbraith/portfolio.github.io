// projectSkillsLoader.js

const PROJECT_SKILLS = {
  // Tools & Technologies
  sharepoint:   { alt: "SharePoint",              label: "SharePoint",              file: "SharePoint.png" },
  office365:    { alt: "Office 365",              label: "Office 365",              file: "Office365.png" },
  ubuntu:       { alt: "Linux",                   label: "Ubuntu KVM",              file: "linux.png" },
  libvirt:      { alt: "Networking",              label: "Libvirt",                 file: "network.png" },
  qemu:         { alt: "Virtualization",          label: "QEMU",                    file: "virtual.png" },
  shell:        { alt: "Shell Scripting",         label: "Shell Scripting",         file: "programing.png" }, 
  permissions:  { alt: "Permissions",             label: "Permissions",             file: "repair.png" }, 
  ad:           { alt: "Active Directory",        label: "Active Directory",        file: "cloud.png" },
  python:       { alt: "Python",                  label: "Python",                  file: "python.png" },
  woodwork:     { alt: "Joinery & Carpentry",     label: "Joinery & Carpentry",     file: "woodwork.png" },
  tools:        { alt: "Power Tools & Safety",    label: "Power Tools & Safety",    file: "tools.png" },

  // Key Learnings
  debugging:    { alt: "Debugging",               label: "Debugging",               file: "problem-solving.png" },
  collaboration:{ alt: "Collaboration & Testing", label: "Collaboration & Testing", file: "teamwork.png" },
  automation:   { alt: "System Automation",       label: "System Automation",       file: "linux.png" },
  security:     { alt: "Security Best Practices", label: "Security Best Practices", file: "degree.png" },
  gps:          { alt: "GPS Integration",         label: "GPS Integration",         file: "gps_tracking.png" },
  ux:           { alt: "User Experience Design",  label: "User Experience Design",  file: "user_experience.png" }
};


function renderProjectSkills() {
  const sections = document.querySelectorAll('[data-project-skills]');
  sections.forEach(container => {
    const keys = container.dataset.projectSkills.split(',').map(k => k.trim());
    container.innerHTML = "";

    keys.forEach(key => {
      const skill = PROJECT_SKILLS[key];
      if (!skill) return;

      const item = document.createElement("div");
      item.className = "icon-item";

      const img = document.createElement("img");
      img.src = `images/icons/optimized/${skill.file}`; 
      img.alt = skill.alt;
      img.className = "li-icon";

      const span = document.createElement("span");
      span.textContent = skill.label;

      item.appendChild(img);
      item.appendChild(span);
      container.appendChild(item);
    });
  });
}

document.addEventListener("DOMContentLoaded", renderProjectSkills);
