const ProjectSteps = {
  thematic: [
    {
      title: "1. Conduct Thematic Analysis in Excel",
      img: "ThermaticExcel.png",
      alt: "Excel Thematic Analysis",
      text: "Begin by identifying themes, factors, and raw codes within Excel. Use structured sheets to categorize data extracted from source material."
    },
    {
      title: "2. Update Factors and Related Groups/Sub-Groups",
      img: "UpdateFactors.png",
      alt: "Updating Factors",
      text: "Revise or add new factors in the spreadsheet and associate them with the correct group and subgroup structures for deeper thematic insight."
    },
    {
      title: "3. Optionally Add Categories and Subcategories",
      img: "Catergories.png",
      alt: "Optional Categories",
      text: "Add higher-level categories and subcategories if your analysis benefits from hierarchical organization beyond groups."
    },
    {
      title: "4. Add Search Metadata for Categories/Subcategories",
      img: "SearchData.png",
      alt: "Search Tags",
      text: "Enhance your data structure by assigning searchable tags to factors. These will assist in filtering and future retrieval within the web app."
    },
    {
      title: "5. Export Data to Webpage",
      img: "Export.png",
      alt: "Exporting to Webpage",
      text: "Use the provided Python scripts to extract, clean, and convert Excel data into JSON. Then populate the HTML structure dynamically with this content."
    },
    {
      title: "6. Review Glossary",
      img: "Glossary.png",
      alt: "Glossary and Analysis View",
      text: "The final HTML output includes a glossary of terms and relating catergoroies and sub catergories"
    },
    {
      title: "7. Review Web Analysis",
      img: "WebAnalysis.png",
      alt: "Web Analysis View",
      text: "The final HTML output includes a glossary of terms and grouped factors, allowing for user-friendly browsing and review of the thematic structure."
    }
  ],

  quiz: [
    {
      title: "Update Custom Q&A",
      img: "QuizCreatorScreenShot-Excel.png",
      alt: "Quiz",
      text: "Add questions and answers to the spreadsheet. Each question includes multiple answers and an explanation of the correct answer."
    },
    {
      title: "Update the Webpage",
      img: "quiz-updateFlow.png",
      alt: "Quiz Python Program Flow Chart",
      text: "Run the Python program located in the Python-Import folder called Python-Update-Webpage.py."
    },
    {
      title: "Select a Quiz",
      img: "QuizCreatorScreenShot-QuizIndex.png",
      alt: "Quiz Main Page",
      text: "To run the quiz open the index.html. For the best experience, use Google Chrome or Chromium to avoid JSON caching issues in other browsers."
    },
    {
      title: "Check Each Answer",
      img: "QuizCreatorScreenShot-QuizPostAns.png",
      alt: "Quiz Question Check",
      text: "After answering each question and pressing the 'Submit' button, the quiz shows if your answer was correct and provides a short explanation."
    },
    {
      title: "Quiz Summary",
      img: "QuizCreatorScreenShot-QuizRedsults.png",
      alt: "Quiz Results",
      text: "Once all questions are answered, clicking 'Submit Quiz' shows a summary of your results."
    },
    {
      title: "Custom Quizzes",
      img: "QuizCreatorScreenShot-QuizExcelSheetDefine.png",
      alt: "Quiz ExcelSheet Definition",
      text: "Although the quiz currently uses CyberOps module questions, you can create new Excel spreadsheets for other topics. Update the Excel file path in import-Tool-Data.py to use the new dataset."
    }
  ]
};

function loadProjectSteps(containerSelector, steps) {
  const container = document.querySelector(containerSelector);
  if (!container || !steps || steps.length === 0) return;

  steps.forEach(({ title, img, alt, text }) => {
    const box = document.createElement("div");
    box.className = "boxed-content";

    const h2 = document.createElement("h2");
    h2.className = "centered-title";
    h2.textContent = title;

    const wrapper = document.createElement("div");
    wrapper.className = "image-zoom-wrapper";

    const imgDiv = document.createElement("div");
    imgDiv.className = "responsive-image";
    imgDiv.dataset.imgName = img;
    imgDiv.dataset.alt = alt;
    imgDiv.dataset.class = "centre-img";

    wrapper.appendChild(imgDiv);

    const p = document.createElement("p");
    p.textContent = text;

    box.appendChild(h2);
    box.appendChild(wrapper);
    box.appendChild(p);

    container.appendChild(box);
    container.appendChild(document.createElement("br"));
  });
}

// Load based on data-project attribute
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".main-content-text section");
  const project = document.body.dataset.project;

  if (container && ProjectSteps[project]) {
    loadProjectSteps(".main-content-text section", ProjectSteps[project]);
  }
});
