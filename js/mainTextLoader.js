// js/mainTextLoader.js
// Controller class to handle injecting content from MAIN_TEXT_DATA into HTML elements

class MainTextController {
  static render(dataKey, dataSource, targetElement) {
    const content = dataSource[dataKey];
    if (!content || !targetElement) return;

    // Append paragraphs
    content.paragraphs?.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      targetElement.appendChild(p);
    });

    // Append lists
    content.lists?.forEach(list => {
      if (list.title) {
        const heading = document.createElement('h3');
        heading.textContent = list.title;
        targetElement.appendChild(heading);
      }
      const ul = document.createElement('ul');
      list.items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item; // Allow <a> and other inline HTML
        ul.appendChild(li);
      });
      targetElement.appendChild(ul);
    });
  }
}

// DOMContentLoaded: Look for elements with data-main-text and populate them
document.addEventListener("DOMContentLoaded", () => {
  const target = document.querySelector('[data-main-text]');
  if (!target) return;

  const key = target.dataset.mainText;
  MainTextController.render(key, MAIN_TEXT_DATA, target);
});
