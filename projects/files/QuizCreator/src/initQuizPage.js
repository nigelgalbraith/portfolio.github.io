document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, initializing quiz...');

  const urlParams = new URLSearchParams(window.location.search);
  const moduleKey = parseInt(urlParams.get('module'), 10) || 1;
  console.log(`Module Key: ${moduleKey}`);

  const moduleNamesParam = urlParams.get('names');
  console.log('Module names parameter:', moduleNamesParam);

  const moduleNames = JSON.parse(decodeURIComponent(moduleNamesParam)) || {};
  console.log('Decoded module names:', moduleNames);

  const numQuestions = parseInt(urlParams.get('numQuestions'), 10) || 0;
  console.log(`Number of Questions: ${numQuestions}`);

  const { quiz } = Controller.setup(jsonData);
  console.log('Quiz initialized:', quiz);

  const moduleQuestions = quiz.getQuestionsByModule(moduleKey);
  console.log(`Retrieved questions for module ${moduleKey}:`, moduleQuestions);

  const selectedQuestions = numQuestions > 0
    ? moduleQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestions)
    : moduleQuestions;

  console.log(`Selected questions (${selectedQuestions.length}):`, selectedQuestions);

  const moduleName = moduleNames[moduleKey] || 'Module Not Found';
  document.getElementById('quizHeading').textContent = `Multiple Choice Quiz: ${moduleName}`;
  console.log(`Quiz heading set to: ${moduleName}`);

  const quizContainer = document.getElementById('quizContainer');
  if (selectedQuestions.length > 0) {
    selectedQuestions.forEach(question => {
      const questionElement = question.createQuestionElement();
      quizContainer.appendChild(questionElement);
      console.log('Appended question element:', questionElement);
    });
  } else {
    quizContainer.innerHTML = '<p>No questions available for this module.</p>';
    console.log('No questions available for this module.');
  }

  document.getElementById('submitQuiz').onclick = () => {
    console.log('Submit button clicked.');

    const results = selectedQuestions.map(question => {
      question.checkAnswer(); // Mark answer and give feedback
      const result = {
        question: question.question,
        userAnswer: question.userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect:
          question.userAnswer.length > 0 &&
          question.correctAnswer.every(ans => question.userAnswer.includes(ans)) &&
          question.userAnswer.length === question.correctAnswer.length
      };
      console.log('Question result:', result);
      return result;
    });

    localStorage.setItem('quizResults', JSON.stringify(results));
    console.log('Results saved to localStorage:', results);
    window.location.href = 'results.html';
  };
});
