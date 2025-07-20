// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, initializing quiz...');

  // Get module key from URL parameter (default to 1 if not set)
  const urlParams = new URLSearchParams(window.location.search);
  const moduleKey = parseInt(urlParams.get('module'), 10) || 1;
  console.log(`Module Key: ${moduleKey}`);

  // Get module name mapping from URL parameter
  const moduleNamesParam = urlParams.get('names');
  console.log('Module names parameter:', moduleNamesParam);

  // Decode and parse module names JSON
  const moduleNames = JSON.parse(decodeURIComponent(moduleNamesParam)) || {};
  console.log('Decoded module names:', moduleNames);

  // Get number of questions to show (0 = all)
  const numQuestions = parseInt(urlParams.get('numQuestions'), 10) || 0;
  console.log(`Number of Questions: ${numQuestions}`);

  // Initialize quiz controller and fetch quiz data
  const { quiz } = Controller.setup(jsonData);
  console.log('Quiz initialized:', quiz);

  // Get all questions for the selected module
  const moduleQuestions = quiz.getQuestionsByModule(moduleKey);
  console.log(`Retrieved questions for module ${moduleKey}:`, moduleQuestions);

  // Randomly select questions if numQuestions > 0, otherwise use all
  const selectedQuestions = numQuestions > 0
    ? moduleQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestions)
    : moduleQuestions;
  console.log(`Selected questions (${selectedQuestions.length}):`, selectedQuestions);

  // Set heading using the module name
  const moduleName = moduleNames[moduleKey] || 'Module Not Found';
  document.getElementById('quizHeading').textContent = `Multiple Choice Quiz: ${moduleName}`;
  console.log(`Quiz heading set to: ${moduleName}`);

  // Render the questions in the quiz container
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

  // Handle quiz submission
  document.getElementById('submitQuiz').onclick = () => {
    console.log('Submit button clicked.');

    // Evaluate each question and record result
    const results = selectedQuestions.map(question => {
      question.checkAnswer(); // Evaluate user's selected answers

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

    // Save results to localStorage for result page display
    localStorage.setItem('quizResults', JSON.stringify(results));
    console.log('Results saved to localStorage:', results);

    // Hide quiz content after submission
    quizContainer.style.display = 'none';
    document.getElementById('submitQuiz').style.display = 'none';

    // Call results display function (defined elsewhere)
    if (typeof displayResultsFromLocalStorage === 'function') {
      displayResultsFromLocalStorage();

      // Scroll to top after delay to ensure results are rendered
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      console.error('displayResultsFromLocalStorage() is not defined.');
    }

    // Reveal back buttons for navigation
    const backButton = document.getElementById('backToIndex');
    const backButtonTop = document.getElementById('backToIndexTop');

    [backButton, backButtonTop].forEach(button => {
      if (button) {
        button.style.display = 'inline-block';
        button.onclick = () => {
          window.location.href = 'Index.html';
        };
      }
    });
  };
});
