// js/resumeLoader.js
// Dynamically injects resume content from resumeData.js into the resume page

document.addEventListener("DOMContentLoaded", () => {
  injectProfessionalOutline("professional-outline", resumeData.professionalOutline);
  loadExperience("#experience-timeline", resumeData.experience);
  loadQualifications("#qualifications-timeline", resumeData.qualifications);
  loadResumeLinks("#resume-links", resumeData.resumeLinks);
});

function injectProfessionalOutline(selectorId, text) {
  const container = document.getElementById(selectorId);
  if (!container || !text) return;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  container.appendChild(paragraph);
}

// Builds experience timeline items
function loadExperience(selector, items) {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(items)) return;

  items.forEach(({ date, role, company, location, outline, achievements, subRoles }) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = date;

    const content = document.createElement("div");
    content.className = "time-content";

    const h2 = document.createElement("h2");
    h2.textContent = role;

    const h3 = document.createElement("h3");
    h3.textContent = `${company}, ${location}`;

    const hiddenDate = document.createElement("div");
    hiddenDate.className = "hidden-time";
    hiddenDate.textContent = date;

    const outlineHeader = document.createElement("h4");
    outlineHeader.textContent = "Outline";

    const outlineList = document.createElement("ul");
    outline.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      outlineList.appendChild(li);
    });

    const achievementHeader = document.createElement("h4");
    achievementHeader.textContent = "Key achievements/projects";

    const achievementList = document.createElement("ul");
    achievements.forEach(line => {
      const li = document.createElement("li");
      li.textContent = line;
      achievementList.appendChild(li);
    });

    content.appendChild(h2);
    content.appendChild(h3);
    content.appendChild(hiddenDate);
    content.appendChild(outlineHeader);
    content.appendChild(outlineList);
    content.appendChild(achievementHeader);
    content.appendChild(achievementList);

    // Sub-roles if any
    if (Array.isArray(subRoles)) {
      subRoles.forEach(({ title, date, items }) => {
        const subItem = document.createElement("div");
        subItem.className = "sub-timeline-item";

        const subContent = document.createElement("div");
        subContent.className = "sub-timeline-item-content";

        const subTitle = document.createElement("h4");
        subTitle.textContent = title;

        const subList = document.createElement("ul");
        items.forEach(point => {
          const li = document.createElement("li");
          li.textContent = point;
          subList.appendChild(li);
        });

        const subDate = document.createElement("div");
        subDate.className = "sub-role-date";
        subDate.textContent = date;

        subContent.appendChild(subTitle);
        subContent.appendChild(subList);
        subItem.appendChild(subContent);
        subItem.appendChild(subDate);
        content.appendChild(subItem);
      });
    }

    item.appendChild(time);
    item.appendChild(content);
    container.appendChild(item);
  });
}

// Builds qualifications timeline items
function loadQualifications(selector, items) {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(items)) return;

  items.forEach(({ date, institution, awards }) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = date;

    const content = document.createElement("div");
    content.className = "time-content";

    const h2 = document.createElement("h2");
    h2.textContent = institution;

    const ul = document.createElement("ul");
    awards.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = entry;
      ul.appendChild(li);
    });

    const mobileDate = document.createElement("div");
    mobileDate.className = "hidden-time";
    mobileDate.textContent = date;

    content.appendChild(h2);
    content.appendChild(ul);
    content.appendChild(mobileDate);

    item.appendChild(time);
    item.appendChild(content);
    container.appendChild(item);
  });
}

// Builds resume download links
function loadResumeLinks(selector, links) {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(links)) return;

  const grid = document.createElement("div");
  grid.className = "icon-grid";

  links.forEach(({ label, href, icon, alt }) => {
    const a = document.createElement("a");
    a.className = "grouped-list-item-button-link";
    a.href = href;
    a.target = "_blank";

    const item = document.createElement("div");
    item.className = "icon-item";

    const img = document.createElement("img");
    img.className = "li-icon";
    img.src = icon;
    img.alt = alt;

    const span = document.createElement("span");
    span.textContent = label;

    item.appendChild(img);
    item.appendChild(span);
    a.appendChild(item);
    grid.appendChild(a);
  });

  container.appendChild(grid);
}
