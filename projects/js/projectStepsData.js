const ProjectSteps = {
// Step-by-step breakdown for the Thematic Analysis project
thematic: [
    {
    title: "Thematic Analysis Structure and Relationships",
    img: "ThematicAnalysisStructureEDR.png",
    alt: "Thematic Analysis Structure and Relationships",
    text: "This project uses a structured workflow to transform raw text into meaningful insights. At its core, the thematic analysis links Extracts (raw data) to Factors (identified themes), which are then grouped into Groups, Sub-Groups, and categorized further. This structured hierarchy allows for powerful visualizations, risk models, and filtering in the final web output.The process begins in Excel, where users record and classify data. A Python script converts the workbook into structured JSON, enabling dynamic exploration on the final webpages"
  },
  {
    title: "Step 1: Enter Extracts and Identify Factors",
    img: "ThematicAnalysisIntial.png",
    alt: "Entering Extracts and Factors",
    text: "Begin by collecting qualitative data such as participant quotes, observations, or written feedback. Each distinct segment referred to as an 'extract' is entered into the Excel workbook. Alongside each extract, note any recurring themes, patterns, or ideas, which are captured as individual 'factors.' This process helps translate unstructured data into traceable, structured inputs. The goal isn’t to force meaning, but to surface genuine insights that emerge from the data"
  },
  {
    title: "Step 2: View Identified Factors",
    img: "FactorInput.png",
    alt: "Viewing Factors",
    text: "After populating the initial extract and factor fields, the built-in Excel macro provides a consolidated view of all identified factors. This is a chance to catch spelling inconsistencies, repeated entries, or missing values. By reviewing this list before progressing, you ensure the thematic framework has integrity and reduces downstream confusion."
  },
  {
    title: "Step 3: Populate the Glossary Table",
    img: "PopulateGlossary.png",
    alt: "Glossary Table",
    text: "The glossary serves as a thematic map. Here, each factor is assigned to broader Groups and Sub-Groups. This classification adds structure and makes it easier to interpret patterns at scale. Instead of viewing factors in isolation, the glossary helps relate them to higher-level themes, aiding both clarity and usability in the final web output."
  },
  {
    title: "Step 4. Assign Group and Sub-Group Values",
    img: "UpdateGroupSubGroup.png",
    alt: "Group and Sub-Group Update",
    text: "Return to the Thematic Analysis sheet and click the 'Update Group' and 'Update Sub Group' buttons. These will fill in the appropriate values from your Glossary Table. If you’re editing entries manually, make sure to clear any old data first to avoid duplicates. The sheet highlights missing group assignments in red, giving you quick visual feedback if something's off."
  },
  {
    title: "Step 5. Refresh the Search Tool Dataset",
    img: "UpdateSearchTool.png",
    alt: "Search Tool Data",
    text: "This step pulls everything together. Run the update function to copy all the finalized factors and their assignments into the Search Tool Data sheet. This dataset powers the dropdown filters and logic behind the web-based search tool, so keeping it up to date ensures accurate results later on."
  },
  {
    title: "Step 6. Define Categories and Sub-Categories",
    img: "UpdateCatSubCat.png",
    alt: "Finalizing Categories",
    text: "Add or review the Category and Sub-Category tags for each factor. You can use the buttons to automatically fill these in from the Glossary Table. Add new rows if you've introduced additional themes during your review. This structure helps support advanced filtering and future reporting."
  },
  {
    title: "Step 7. Export for Web Use",
    img: "TAPythonWebUpdate.png",
    alt: "Exporting Thematic Analysis",
    text: "Once everything looks good, save the workbook as 'Thematic-Analysis-Complete.xlsm'. Then run the 'Python-Update-Webpage.py' script from the Python-Import folder. This script turns your structured Excel data into JSON and HTML, which power the interactive web pages for analysis and search."
  },
  {
    title: "Step 8. Use the Search Tool Webpage",
    img: "WebSearchTool.png",
    alt: "Search Tool Output",
    text: "With the export complete, you can now explore your data through the interactive Search Tool. Use the dropdowns to filter by Category, Sub-Category, Group, or Sub-Group. It also includes a glossary and full factor list, making it easy to locate key themes and track their source."
  },
  {
    title: "Step 9. Review the Thematic Analysis Web Output",
    img: "ThematicWebResults.png",
    alt: "Thematic Analysis Output",
    text: "This page lays out your entire thematic structure visually. You’ll see Groups, their linked Factors, and the Extracts they were drawn from. Depending on the data, you might also see visual metrics like risk levels or frequency scores. It’s a great way to step back and get a full-picture view."
  },
  {
    title: "Groupings Overview",
    img: "GroupingsWeb.png",
    alt: "Thematic Analysis Groupings Output",
    text: "This visualization shows how factors are grouped into broader themes. It’s a quick way to see where patterns are forming and which areas are more densely populated. Ideal for finding common threads or comparing thematic clusters across the dataset."
  },
  {
    title: "Factor-Level Analysis",
    img: "FactorAnalysisWeb.png",
    alt: "Thematic Analysis Factor Analysis Output",
    text: "Dive into each factor to see how often it appears, what context it's used in, and which themes it supports. This helps surface which ideas are most influential, underused, or worth following up on. Great for prioritising themes or backing up decisions with data."
  },
  {
    title: "Group-Level Analysis",
    img: "GroupAnalysisWeb.png",
    alt: "Thematic Analysis Group Analysis Output",
    text: "This breakdown shows the size, spread, and relative weight of each Group. You can compare how often each theme is mentioned and how it connects to others. It’s helpful when you want to identify dominant topics or check for gaps in coverage."
  },
  {
    title: "Sub-Group Analysis",
    img: "SubGroupAnalysisWeb.png",
    alt: "Thematic Analysis Sub Group Analysis Output",
    text: "Takes you deeper into the smaller, more focused themes within each Group. Sub-Groups can highlight niche concerns, outliers, or specific issues tied to a broader topic. Use this when you need to fine-tune your insights or tailor your findings to a specific audience."
  },
  {
    title: "Risk Model Creator",
    img: "RiskModelCreatorWeb.png",
    alt: "Thematic Analysis Risk Model Creator Output",
    text: "This tool lets you build custom risk models based on the grouped factors. You can define scenarios, assign risk levels, and visually map out how different themes impact potential outcomes. It's especially useful if you’re turning qualitative data into action plans or dashboards."
  }
  ],

  // Step-by-step breakdown for the quiz creator project
  quiz: [
  {
    title: "Step 1: Add Custom Questions and Answers",
    img: "QuizCreatorScreenShot-Excel.png",
    alt: "Quiz",
    text: "Start by entering your quiz content into the Excel workbook. Each row includes a question, multiple choice answers, the correct answer, and a short explanation. This layout gives you flexibility to define your own topics and maintain consistent formatting across all quizzes."
  },
  {
    title: "Step 2: Generate the Webpage Content",
    img: "quiz-updateFlow.png",
    alt: "Quiz Python Program Flow Chart",
    text: "Once your spreadsheet is ready, run the Python script named 'Python-Update-Webpage.py' from the Python-Import folder. This script processes the Excel file and generates HTML and JSON files that drive the interactive quiz in the browser."
  },
  {
    title: "Step 3: Launch the Quiz Selector",
    img: "QuizCreatorScreenShot-QuizIndex.png",
    alt: "Quiz Main Page",
    text: "Open the index.html file to launch the quiz selector page. From here, users can choose which quiz to take. Each quiz is linked to the dataset you defined in the Excel workbook, allowing for quick testing and review."
  },
  {
    title: "Step 4: Submit and Check Your Answers",
    img: "QuizCreatorScreenShot-QuizPostAns.png",
    alt: "Quiz Question Check",
    text: "As users complete the quiz, they can click 'Submit' after each question to receive instant feedback. The app highlights the correct answer and provides a brief explanation, making it useful for both practice and reinforcement."
  },
  {
    title: "Step 5: Review the Quiz Summary",
    img: "QuizCreatorScreenShot-QuizRedsults.png",
    alt: "Quiz Results",
    text: "After completing all the questions, clicking 'Submit Quiz' will generate a summary of the user’s performance. This includes the number of correct answers, a list of incorrect responses, and links to explanations for review."
  },
  {
    title: "Step 6: Build and Load Custom Quizzes",
    img: "QuizCreatorScreenShot-QuizExcelSheetDefine.png",
    alt: "Quiz ExcelSheet Definition",
    text: "While the default quizzes use CyberOps examples, you can easily adapt the tool for other topics. Just create a new Excel file using the same structure, then update the path in the 'import-Tool-Data.py' script to point to your new file. The rest of the system will adapt automatically."
  }
  ],
  portfolio:[
  {
    title: "Planning the Architecture",
    text: "Before writing code, I planned out how I wanted the entire site structured—what pages it would need, what elements would be reused, and how I could modularise layout and logic using plain HTML, CSS, and JavaScript. The result was a layout that prioritised flexibility and manual control, without relying on any frameworks.",
    image: "StructureDiagram.png",
    alt: "Site folder structure diagram"
  },
  {
    title: "Creating the Template System",
    text: "To reduce duplication and keep things maintainable, I used JavaScript modules to inject common components—footer, navigation bar, project steps, image loaders, and icon grids. This allowed me to make global changes across all project pages by editing a single file.",
    image: "TemplateInjection.png",
    alt: "Example of dynamic HTML injection"
  },
  {
    title: "Project Pages and Data Mapping",
    text: "Each project has a dedicated HTML page that loads content dynamically based on the `data-project` attribute in the `<body>` tag. The corresponding entry in `projectStepsData.js` controls which steps and images are shown, allowing all project pages to reuse the same structure and logic.",
    image: "DynamicProjectSteps.png",
    alt: "Dynamic step loader code"
  },
  {
    title: "Responsive Image Loader",
    text: "I wrote a small script that loads images responsively by switching between resolutions based on screen size. This keeps load times fast without sacrificing quality on larger displays. Images are zoomable using a modular lightbox script.",
    image: "ResponsiveImages.png",
    alt: "Zoomable and responsive image example"
  },
  {
    title: "Deployment and Hosting",
    text: "Once everything was functional and polished, I hosted the site using GitHub Pages. I also created a `.zip` version so people could download and inspect the full source. All pages are static and can be run locally with no dependencies.",
    image: "Deployment.png",
    alt: "Deployment on GitHub Pages"
  }
  ]
};


// Function to generate and insert step content into the page
function loadProjectSteps(containerSelector, steps) {
  const container = document.querySelector(containerSelector);
  if (!container || !steps || steps.length === 0) return;

  steps.forEach(({ title, img, alt, text }) => {
    const box = document.createElement("div");
    box.className = "boxed-content";

    // Step title
    const h2 = document.createElement("h2");
    h2.className = "centered-title";
    h2.textContent = title;

    // Image wrapper for zoom functionality
    const wrapper = document.createElement("div");
    wrapper.className = "image-zoom-wrapper";

    // Placeholder div that gets replaced by responsive image logic elsewhere
    const imgDiv = document.createElement("div");
    imgDiv.className = "responsive-image";
    imgDiv.dataset.imgName = img;
    imgDiv.dataset.alt = alt;
    imgDiv.dataset.class = "centre-img";

    wrapper.appendChild(imgDiv);

    // Descriptive text for the step
    const p = document.createElement("p");
    p.textContent = text;

    // Assemble and append everything
    box.appendChild(h2);
    box.appendChild(wrapper);
    box.appendChild(p);

    container.appendChild(box);
    container.appendChild(document.createElement("br"));
  });
}

// Automatically load steps on DOM ready, based on body data attribute
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".main-content-step-text section");
  const project = document.body.dataset.project;

  // Load only if matching project data exists
  if (container && ProjectSteps[project]) {
    loadProjectSteps(".main-content-step-text section", ProjectSteps[project]);
  }
});
