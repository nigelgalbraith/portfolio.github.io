const ProjectSteps = {
  thematic: [
    {
      title: "1. Enter Extracts and Identify Factors",
      img: "ThematicAnalysisIntial.png",
      alt: "Entering Extracts and Factors",
      text: "Begin your thematic analysis by entering extracts into Excel and filling out all relevant fields. Identify and add all factors present in the data."
    },
    {
      title: "2. View Identified Factors",
      img: "FactorInput.png",
      alt: "Viewing Factors",
      text: "Click the 'Check Factors' button to review all factors that have been identified within the dataset."
    },
    {
      title: "3. Populate the Glossary Table",
      img: "PopulateGlossary.png",
      alt: "Glossary Table",
      text: "Add each identified factor to the Glossary table and associate them with the correct Groups and Sub-Groups."
    },
    {
      title: "4. Update Group and Sub-Group Assignments",
      img: "UpdateGroupSubGroup.png",
      alt: "Group and Sub-Group Update",
      text: "Return to the Thematic Analysis sheet and click the 'Update Group' and 'Update Sub Group' buttons. If adding factors manually, be sure to remove any existing content first to avoid duplication. Glossary cells turn red if factors are missing."
    },
    {
      title: "5. Update the Search Tool Data",
      img: "UpdateSearchTool.png",
      alt: "Search Tool Data",
      text: "Update the Search Tool Data sheet to ensure it includes all relevant factors from your thematic analysis."
    },
    {
      title: "6. Finalize Category and Sub-Category Tags",
      img: "UpdateCatSubCat.png",
      alt: "Finalizing Categories",
      text: "Use the 'Update Category' and 'Update Sub-Category' buttons. Add extra rows if needed to ensure full coverage of factors."
    },
    {
      title: "7. Save and Export Thematic Data",
      img: "TAPythonWebUpdate.png",
      alt: "Exporting Thematic Analysis",
      text: "Save the workbook as Thematic-Analysis-Complete.xlsm. Then run the Python program located in the Python-Import folder called Python-Update-Webpage.py.to generate HTML files for both the Thematic Analysis and Search Tool webpages."
    },
    {
      title: "8. Search Tool Webpage Output",
      img: "WebSearchTool.png",
      alt: "Search Tool Output",
      text: "The HTML output includes a glossary of terms and searchable dropdown filters showing Categories, Sub-Categories, Groups, and Sub-Groups."
    },
    {
      title: "9. Thematic Analysis Web Output",
      img: "ThematicWebResults.png",
      alt: "Thematic Analysis Output",
      text: "The final webpage displays glossary terms and grouped thematic data, including risk assessment visuals and group/sub-group breakdowns."
    },
    {
      title: "Groupings",
      img: "GroupingsWeb.png",
      alt: "Thematic Analysis Groupings Output",
      text: ""
    },
    {
      title: "Factor Analysis",
      img: "FactorAnalysisWeb.png",
      alt: "Thematic Analysis Factor Analysis Output",
      text: ""
    },
    {
      title: "Group Analysis",
      img: "GroupAnalysisWeb.png",
      alt: "Thematic Analysis Group Analysis Output",
      text: ""
    },
    {
      title: "Sub Group Analysis",
      img: "SubGroupAnalysisWeb.png",
      alt: "Thematic Analysis Sub Group Analysis Output",
      text: ""
    },
    {
      title: "Risk Model Creator",
      img: "RiskModelCreatorWeb.png",
      alt: "Thematic Analysis Risk Model Creator Output",
      text: ""
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
      text: "To run the quiz selection menu open the index.html."
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
