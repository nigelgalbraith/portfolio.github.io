class Controller {
  static setup(jsonData) {
    const theSearchTool = new Quiz('Multi-Choice-Test');
    const moduleNames = {}; // Create a map for module IDs to module names

    // Log the start of the setup process
    console.log('Setting up the quiz with the following data:');
    console.log(jsonData);

    // Iterate over each module in the JSON data
    jsonData.forEach(module => {
      const moduleName = module["Module Name"];
      const moduleId = module["Module"];

      // Store module name in the map
      moduleNames[moduleId] = moduleName;

      // Log module processing
      console.log(`Processing Module: ID=${moduleId}, Name=${moduleName}`);

      // Iterate over each entry in the module's data
      module["Questions"].forEach(entry => {
        // Extract data from the entry
        const questionText = entry["Question"];
        const multipleAnswers = Array.isArray(entry["Multiple Answers"]) ? 
          entry["Multiple Answers"].map(a => String(a)) : [String(entry["Multiple Answers"])];
        const correctAnswer = Array.isArray(entry["Correct Answer"]) ? 
          entry["Correct Answer"].map(a => String(a)) : [String(entry["Correct Answer"])];
        const explanation = entry["Explanation"]; // Extract the explanation
        const moduleKey = moduleId; // Use module ID here directly

        // Log question processing
        console.log(`Processing Question: ID=${entry["ID"]}`);
        console.log(`Question Text: ${questionText}`);
        console.log(`Multiple Answers: ${multipleAnswers}`);
        console.log(`Correct Answer: ${correctAnswer}`);
        console.log(`Explanation: ${explanation}`);

        // Create a new Question object
        const questionInstance = new Question(
          entry["ID"], 
          moduleKey, 
          moduleName,  // Pass the moduleName to the Question
          questionText, 
          multipleAnswers, 
          correctAnswer,
          explanation // Pass the explanation to the Question
        );

        // Log the addition of the question
        console.log(`Adding Question to Quiz: ID=${entry["ID"]}`);

        // Add the question to the search tool
        theSearchTool.addQuestion(questionInstance);
      });
    });

    // Log the completion of the setup process
    console.log('Quiz setup complete.');
    console.log('Module Names:', moduleNames);

    // Return the Quiz instance and module names
    return { quiz: theSearchTool, moduleNames };
  }
}
