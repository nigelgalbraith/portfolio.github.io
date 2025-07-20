// Initialize the modules from the JSON data using the static setup method
const { quiz, moduleNames } = Controller.setup(jsonData);

// Get the module list container from the DOM
const moduleList = document.getElementById('moduleList');

// Populate the module list dynamically
Object.entries(moduleNames).forEach(([moduleID, moduleName]) => {
  // Create a list item to hold this module entry
  const listItem = document.createElement('li');

  // Create a container to hold the heading and input/button section
  const container = document.createElement('div');

  // Create and configure the module heading (e.g., "1 - Introduction")
  const moduleHeading = document.createElement('span');
  moduleHeading.textContent = `${moduleID} - ${moduleName}`;
  moduleHeading.className = 'moduleHeading';
  container.appendChild(moduleHeading);

  // Container for the input box and button side by side
  const inputButtonContainer = document.createElement('div');
  inputButtonContainer.className = 'inputButtonContainer';

  // Create an input for the user to choose number of quiz questions
  const numQuestionsInput = document.createElement('input');
  numQuestionsInput.type = 'number';
  numQuestionsInput.min = '1';
  numQuestionsInput.placeholder = 'Number of Questions';
  numQuestionsInput.className = 'inputNumberQuestions';
  inputButtonContainer.appendChild(numQuestionsInput);

  // Create the Start Quiz button and set its behavior
  const startButton = document.createElement('button');
  startButton.textContent = 'Start Quiz';
  startButton.className = 'startQuizButton';
  
  // When clicked, validate input and redirect to quiz page with parameters
  startButton.onclick = () => {
    const numQuestions = numQuestionsInput.value;

    if (numQuestions > 0) {
      const moduleNamesParam = encodeURIComponent(JSON.stringify(moduleNames));
      window.location.href = `module.html?module=${moduleID}&names=${moduleNamesParam}&numQuestions=${numQuestions}`;
    } else {
      alert('Please enter a valid number of questions.');
    }
  };

  // Add the button to the input/button container
  inputButtonContainer.appendChild(startButton);

  // Assemble the module entry and add it to the list
  container.appendChild(inputButtonContainer);
  listItem.appendChild(container);
  moduleList.appendChild(listItem);
});
