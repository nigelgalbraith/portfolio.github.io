document.addEventListener('DOMContentLoaded', () => {
  const results = JSON.parse(localStorage.getItem('quizResults'));
  console.log('Results from localStorage:', results);

  const summaryContainer = document.getElementById('summary');
  const resultsContainer = document.getElementById('resultsContainer');

  let correctCount = 0;
  let incorrectCount = 0;

  if (results) {
    const incorrectHeading = document.createElement('h2');
    incorrectHeading.textContent = 'Incorrect Answers';
    resultsContainer.appendChild(incorrectHeading);

    results.forEach(result => {
      const isCorrect = Array.isArray(result.correctAnswer)
        ? result.correctAnswer.length === result.userAnswer.length &&
          result.correctAnswer.every((val, index) => val === result.userAnswer[index])
        : result.userAnswer === result.correctAnswer;

      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;

        const resultElement = document.createElement('div');
        resultElement.className = 'result incorrect-answer';

        const questionText = document.createElement('p');
        questionText.textContent = `Question: ${result.question}`;
        resultElement.appendChild(questionText);

        const userAnswer = document.createElement('p');
        userAnswer.textContent = `Your answer: ${result.userAnswer}`;
        resultElement.appendChild(userAnswer);

        const correctAnswer = document.createElement('p');
        correctAnswer.textContent = `Correct answer: ${result.correctAnswer}`;
        resultElement.appendChild(correctAnswer);

        if (result.explanation) {
          const explanationText = document.createElement('p');
          explanationText.innerHTML = `<span class="explanation-heading">Explanation:</span> <span class="explanation-text">${result.explanation}</span>`;
          resultElement.appendChild(explanationText);
        }

        resultsContainer.appendChild(resultElement);
      }
    });

    const summaryElement = document.createElement('div');
    summaryElement.className = 'summary';

    const correctCountElement = document.createElement('p');
    correctCountElement.textContent = `Number of correct answers: ${correctCount}`;
    summaryElement.appendChild(correctCountElement);

    const incorrectCountElement = document.createElement('p');
    incorrectCountElement.textContent = `Number of incorrect answers: ${incorrectCount}`;
    summaryElement.appendChild(incorrectCountElement);

    summaryContainer.appendChild(summaryElement);

    if (incorrectCount === 0) {
      resultsContainer.textContent = 'All answers are correct.';
    }
  } else {
    summaryContainer.textContent = 'No results available.';
  }
});
