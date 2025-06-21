// Initialize the modules from the JSON data using the static setup method
const { quiz, moduleNames } = Controller.setup(jsonData);

// Get the module list container
const moduleList = document.getElementById('moduleList');

// Populate the list with modules
Object.entries(moduleNames).forEach(([moduleID, moduleName]) => {
  const listItem = document.createElement('li');
  const container = document.createElement('div');

  const moduleHeading = document.createElement('span');
  moduleHeading.textContent = `${moduleID} - ${moduleName}`;
  moduleHeading.className = 'moduleHeading';
  container.appendChild(moduleHeading);

  const inputButtonContainer = document.createElement('div');
  inputButtonContainer.className = 'inputButtonContainer';

  const numQuestionsInput = document.createElement('input');
  numQuestionsInput.type = 'number';
  numQuestionsInput.min = '1';
  numQuestionsInput.placeholder = 'Number of Questions';
  numQuestionsInput.className = 'inputNumberQuestions';
  inputButtonContainer.appendChild(numQuestionsInput);

  const startButton = document.createElement('button');
  startButton.textContent = 'Start Quiz';
  startButton.className = 'startQuizButton';
  startButton.onclick = () => {
    const numQuestions = numQuestionsInput.value;
    if (numQuestions > 0) {
      const moduleNamesParam = encodeURIComponent(JSON.stringify(moduleNames));
      window.location.href = `module.html?module=${moduleID}&names=${moduleNamesParam}&numQuestions=${numQuestions}`;
    } else {
      alert('Please enter a valid number of questions.');
    }
  };
  inputButtonContainer.appendChild(startButton);

  container.appendChild(inputButtonContainer);
  listItem.appendChild(container);
  moduleList.appendChild(listItem);
});
