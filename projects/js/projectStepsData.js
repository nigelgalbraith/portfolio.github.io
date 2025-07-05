const ProjectSteps = {
thematic: [
    {
    title: "Thematic Analysis Structure and Relationships",
    img: "ThematicAnalysisStructureEDR.png",
    alt: "Thematic Analysis Structure and Relationships",
    text: "This project uses a structured workflow to transform raw text into meaningful insights. At its core, the thematic analysis links Extracts (raw data) to Factors (identified themes), which are then grouped into Groups, Sub-Groups, and categorized further. This structured hierarchy allows for powerful visualizations, risk models, and filtering in the final web output.The process begins in Excel, where users record and classify data. A Python script converts the workbook into structured JSON, enabling dynamic exploration on the final webpages"
  },
  {
    title: "1. Enter Extracts and Identify Factors",
    img: "ThematicAnalysisIntial.png",
    alt: "Entering Extracts and Factors",
    text: "Start by gathering qualitative data such as quotes, comments, or notes and entering each relevant segment (extract) into the Excel workbook. Alongside each extract, identify key ideas or recurring concepts and record them as 'factors'. This step lays the foundation for the entire analysis by transforming raw narrative into structured components. Once all data is entered, a Python script will later convert this structured workbook into JSON format for interactive use on the web."
  },
  {
    title: "2. View Identified Factors",
    img: "FactorInput.png",
    alt: "Viewing Factors",
    text: "After entering your extracts and proposed factors, use the 'Check Factors' button to scan and compile all unique factors that have been identified. This allows you to double-check for duplicates, spelling inconsistencies, or missing entries before proceeding. It's a crucial quality control step to ensure data integrity and reduce noise in later stages."
  },
  {
    title: "3. Populate the Glossary Table",
    img: "PopulateGlossary.png",
    alt: "Glossary Table",
    text: "With a clean list of identified factors, begin building the Glossary Table. Each factor is manually assigned to one or more Groups and Sub-Groups to help classify and organize the themes that emerge. This glossary becomes a central reference point for the rest of the analysis, acting as a thematic map to link extracts with broader conceptual categories."
  },
  {
    title: "4. Update Group and Sub-Group Assignments",
    img: "UpdateGroupSubGroup.png",
    alt: "Group and Sub-Group Update",
    text: "Return to the Thematic Analysis sheet and use the 'Update Group' and 'Update Sub Group' buttons to automatically populate these assignments based on your Glossary Table. If you're manually editing entries, be sure to remove old content to prevent duplicates. Glossary cells will turn red when a factor is missing its Group or Sub-Group, providing instant feedback to avoid data inconsistencies."
  },
  {
    title: "5. Update the Search Tool Data",
    img: "UpdateSearchTool.png",
    alt: "Search Tool Data",
    text: "This step ensures that your Search Tool reflects the latest factor assignments. Run the update to copy all relevant factors and their assigned categories into the Search Tool Data sheet. This dataset feeds the web-based dropdowns and filters used later in the interactive search and analysis interface."
  },
  {
    title: "6. Finalize Category and Sub-Category Tags",
    img: "UpdateCatSubCat.png",
    alt: "Finalizing Categories",
    text: "Add or adjust Category and Sub-Category tags as needed, ensuring each factor is fully classified before export. The 'Update Category' and 'Update Sub-Category' buttons help automate this process. Add additional rows if new themes or domains emerge during your review. This structure will support more advanced filtering and comparisons during analysis."
  },
  {
    title: "7. Save and Export Thematic Data",
    img: "TAPythonWebUpdate.png",
    alt: "Exporting Thematic Analysis",
    text: "Save your completed workbook as 'Thematic-Analysis-Complete.xlsm'. Then, run the Python script located in the 'Python-Import' folder named 'Python-Update-Webpage.py'. This script parses the Excel file and generates JSON and HTML files that power the online Thematic Analysis and Search Tool pages. This makes the analysis accessible, shareable, and interactive."
  },
  {
    title: "8. Search Tool Webpage Output",
    img: "WebSearchTool.png",
    alt: "Search Tool Output",
    text: "Once exported, the Search Tool webpage allows users to explore the full dataset using dropdown filters for Category, Sub-Category, Group, and Sub-Group. It includes a glossary and a table of all factors, letting users drill into specific themes or combinations with ease. This interactive output provides both high-level insights and granular details."
  },
  {
    title: "9. Thematic Analysis Web Output",
    img: "ThematicWebResults.png",
    alt: "Thematic Analysis Output",
    text: "This page visualizes the structured data from your analysis. It displays thematic groups, their associated factors, and the extracts they’re based on. Visual risk scores or other metrics may be included depending on the dataset. The final output serves as both a presentation layer and a tool for exploring deeper thematic relationships."
  },
  {
    title: "Groupings",
    img: "GroupingsWeb.png",
    alt: "Thematic Analysis Groupings Output",
    text: "Shows how factors have been grouped together into broader themes. This visualization highlights thematic clusters and supports comparative analysis across categories. Useful for identifying major areas of concern, strength, or divergence."
  },
  {
    title: "Factor Analysis",
    img: "FactorAnalysisWeb.png",
    alt: "Thematic Analysis Factor Analysis Output",
    text: "Displays a breakdown of each individual factor how often it occurs, in what context, and how it contributes to different groups or categories. This helps assess the weight or importance of specific concepts within the dataset."
  },
  {
    title: "Group Analysis",
    img: "GroupAnalysisWeb.png",
    alt: "Thematic Analysis Group Analysis Output",
    text: "Provides insights into the frequency, distribution, and qualitative relevance of each Group. This level of analysis reveals which themes are most prevalent or interconnected in your data."
  },
  {
    title: "Sub Group Analysis",
    img: "SubGroupAnalysisWeb.png",
    alt: "Thematic Analysis Sub Group Analysis Output",
    text: "Zooms in on more detailed, nuanced themes found within broader Groups. Sub-Group analysis is helpful when refining recommendations, identifying root causes, or customizing findings for specific audiences."
  },
  {
    title: "Risk Model Creator",
    img: "RiskModelCreatorWeb.png",
    alt: "Thematic Analysis Risk Model Creator Output",
    text: "Enables the creation of custom risk models based on grouped factors. You can define scenarios, assign risk levels, and visualize how themes impact different outcomes. Ideal for translating qualitative insights into decision-support tools."
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
