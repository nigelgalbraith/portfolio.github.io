class Question {
  constructor(id, module, moduleName, question, multipleAnswers, correctAnswer, explanation) {
    this.id = id;
    this.module = module;
    this.moduleName = moduleName; // Store the module name
    this.question = question;
    this.multipleAnswers = multipleAnswers;
    this.correctAnswer = correctAnswer;
    this.explanation = explanation; 
    this.userAnswer = []; 

    // Log the creation of a new question
    console.log(`Question Created: ID=${id}, Module=${module}, Module Name=${moduleName}`);
    console.log(`Question Text: ${question}`);
    console.log(`Multiple Answers: ${multipleAnswers}`);
    console.log(`Correct Answer: ${correctAnswer}`);
    console.log(`Explanation: ${explanation}`);
  }

  // Method to get the module ID
  getModule() {
    return this.module;
  }

  // Method to get the module name
  getModuleName() {
    return this.moduleName;
  }

  createQuestionElement() {
    const questionElement = document.createElement('div');
    questionElement.className = 'question';

    // Create question text
    const questionText = document.createElement('p');
    questionText.textContent = this.question;
    questionElement.appendChild(questionText);

    // Determine input type based on number of correct answers
    const isMultipleSelect = Array.isArray(this.correctAnswer) && this.correctAnswer.length > 1;

    this.multipleAnswers.forEach(answer => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = isMultipleSelect ? 'checkbox' : 'radio';
      input.name = `question_${this.id}`;
      input.value = answer;

      label.appendChild(input);
      label.appendChild(document.createTextNode(answer));
      questionElement.appendChild(label);
      questionElement.appendChild(document.createElement('br'));
    });

    // Create a button to submit the answer
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => this.checkAnswer(questionElement);
    questionElement.appendChild(document.createElement('br'));
    questionElement.appendChild(submitButton);

    return questionElement;
  }

  checkAnswer(questionElement) {
    if (!questionElement) {
      console.error('Question element is undefined or null.');
      return;
    }
  
    // Get selected options
    const selectedOptions = Array.from(questionElement.querySelectorAll('input:checked'));
    this.userAnswer = selectedOptions.map(option => option.value);
  
    // Log the user's answer
    console.log(`User Answer for Question ID=${this.id}: ${this.userAnswer.join(', ')}`);
  
    // Convert answers to strings if they are numbers
    this.userAnswer = this.userAnswer.map(ans => isNaN(ans) ? ans : String(ans));
    this.correctAnswer = this.correctAnswer.map(ans => isNaN(ans) ? ans : String(ans));
  
    // Convert correctAnswer and userAnswer to sets for comparison
    const correctAnswersSet = new Set(this.correctAnswer);
    const userAnswersSet = new Set(this.userAnswer);
  
    const resultText = document.createElement('p');
    const explanationText = document.createElement('p');
  
    // Check if all answers are correct
    const allCorrect = this.userAnswer.length > 0 &&
                       this.userAnswer.length === this.correctAnswer.length &&
                       [...userAnswersSet].every(answer => correctAnswersSet.has(answer)) &&
                       [...correctAnswersSet].every(answer => userAnswersSet.has(answer));
  
    if (allCorrect) {
      resultText.textContent = 'Correct!';
      resultText.style.color = 'green';
      console.log(`Question ID=${this.id} - Answer is correct.`);
    } else {
      resultText.textContent = `Incorrect! The correct answers are: ${this.correctAnswer.join(', ')}`;
      resultText.style.color = 'red';
      explanationText.innerHTML = `<span class="explanation-heading">Explanation:</span> <span class="explanation-text">${this.explanation}</span>`;
      console.log(`Question ID=${this.id} - Answer is incorrect. ${this.explanation}`);
    }
  
    // Disable the inputs after the answer is submitted
    const inputs = questionElement.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);
  
    // Remove the submit button if it exists
    const submitButton = questionElement.querySelector('button');
    if (submitButton) {
      submitButton.remove();
    }
  
    // Append result and explanation
    questionElement.appendChild(resultText);
    if (!allCorrect) {
      questionElement.appendChild(explanationText);
    }
  }  
}
