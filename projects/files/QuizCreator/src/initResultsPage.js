function displayResultsFromLocalStorage() {
  // Retrieve quiz results from localStorage
  const results = JSON.parse(localStorage.getItem('quizResults'));
  console.log('Results from localStorage:', results);

  // Get or create the container for displaying results
  let resultsContainer = document.getElementById('resultsContainer');
  let summaryContainer = document.getElementById('summary');

  if (!resultsContainer) {
    resultsContainer = document.createElement('div');
    resultsContainer.id = 'resultsContainer';
    document.body.appendChild(resultsContainer);
  }

  if (!summaryContainer) {
    summaryContainer = document.createElement('div');
    summaryContainer.id = 'summary';
    document.body.insertBefore(summaryContainer, resultsContainer);
  }

  // Clear previous content
  resultsContainer.innerHTML = '';
  summaryContainer.innerHTML = '';

  let correctCount = 0;
  let incorrectCount = 0;

  // Check if there are results to process
  if (results && results.length > 0) {
    // Create heading for incorrect answers
    const incorrectHeading = document.createElement('h2');
    incorrectHeading.textContent = 'Incorrect Answers';
    resultsContainer.appendChild(incorrectHeading);

    // Loop through each question result
    results.forEach(result => {
      // Determine if answer is correct (supports array and non-array answers)
      const isCorrect = Array.isArray(result.correctAnswer)
        ? result.correctAnswer.length === result.userAnswer.length &&
          result.correctAnswer.every((val, index) => val === result.userAnswer[index])
        : result.userAnswer === result.correctAnswer;

      // Count correct or incorrect answers
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;

        // Create a container for this incorrect result
        const resultElement = document.createElement('div');
        resultElement.className = 'result incorrect-answer';

        // Add question text
        const questionText = document.createElement('p');
        questionText.textContent = `Question: ${result.question}`;
        resultElement.appendChild(questionText);

        // Add user's answer
        const userAnswer = document.createElement('p');
        userAnswer.textContent = `Your answer: ${result.userAnswer}`;
        resultElement.appendChild(userAnswer);

        // Add correct answer
        const correctAnswer = document.createElement('p');
        correctAnswer.textContent = `Correct answer: ${result.correctAnswer}`;
        resultElement.appendChild(correctAnswer);

        // Add explanation if available
        if (result.explanation) {
          const explanationText = document.createElement('p');
          explanationText.innerHTML = `<span class="explanation-heading">Explanation:</span> <span class="explanation-text">${result.explanation}</span>`;
          resultElement.appendChild(explanationText);
        }

        // Append the incorrect answer element to the container
        resultsContainer.appendChild(resultElement);
      }
    });

    // Build summary section
    const summaryElement = document.createElement('div');
    summaryElement.className = 'summary';

    const correctCountElement = document.createElement('p');
    correctCountElement.textContent = `Number of correct answers: ${correctCount}`;
    summaryElement.appendChild(correctCountElement);

    const incorrectCountElement = document.createElement('p');
    incorrectCountElement.textContent = `Number of incorrect answers: ${incorrectCount}`;
    summaryElement.appendChild(incorrectCountElement);

    // Append summary to page
    summaryContainer.appendChild(summaryElement);

    // If no incorrect answers, show a special message
    if (incorrectCount === 0) {
      resultsContainer.textContent = 'All answers are correct.';
    }

    // Make both result containers visible
    resultsContainer.style.display = 'block';
    summaryContainer.style.display = 'block';
  } else {
    // Handle case where there are no saved results
    summaryContainer.textContent = 'No results available.';
  }
}
