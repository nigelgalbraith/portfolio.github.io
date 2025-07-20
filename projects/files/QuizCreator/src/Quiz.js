// Class representing a quiz with multiple questions
class Quiz {
  constructor(name) {
    this.name = name;          // Name of the quiz
    this.questions = [];       // Array to store Question objects
  }

  // Add a new question to the quiz if it's a valid Question instance
  addQuestion(question) {
    if (question instanceof Question) {
      this.questions.push(question);
    } else {
      console.error("Invalid question format");
    }
  }

  // Return the total number of questions in the quiz
  getQuestionCount() {
    return this.questions.length;
  }

  // Return all questions that belong to a specific module
  getQuestionsByModule(moduleId) {
    return this.questions.filter(q => q.module === moduleId);
  }

  // Render all questions to the quiz container in the DOM
  initialize() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';  // Clear any existing content

    // Append each question's DOM element to the container
    this.questions.forEach(question => {
      const questionElement = question.createQuestionElement();
      quizContainer.appendChild(questionElement);
    });
  }
}
