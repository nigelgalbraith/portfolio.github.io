class Quiz {
  constructor(name) {
    this.name = name;
    this.questions = [];
  }

  addQuestion(question) {
    if (question instanceof Question) {
      this.questions.push(question);
    } else {
      console.error("Invalid question format");
    }
  }

  getQuestionCount() {
    return this.questions.length;
  }

  getQuestionsByModule(moduleId) {
    return this.questions.filter(q => q.module === moduleId);
  }  

  initialize() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    this.questions.forEach(question => {
      const questionElement = question.createQuestionElement();
      quizContainer.appendChild(questionElement);
    });
  }
}
