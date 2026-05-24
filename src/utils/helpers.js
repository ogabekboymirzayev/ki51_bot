export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuestions(allQuestions, count, startIndex = 0, endIndex = null) {
  if (endIndex === null) {
    endIndex = allQuestions.length;
  }
  
  // Get questions from the specified range
  const rangeQuestions = allQuestions.slice(startIndex, endIndex);
  const shuffled = shuffleArray(rangeQuestions);
  return shuffled.slice(0, Math.min(count, rangeQuestions.length));
}

// Get sequential questions from a specific range (no shuffling the selection)
export function getSequentialQuestions(allQuestions, startIndex, endIndex) {
  return allQuestions.slice(startIndex, endIndex);
}

export function formatResults(userScores) {
  const results = Array.from(userScores.entries())
    .map(([, data]) => ({
      name: data.name,
      correct: data.correct,
      total: data.total,
      percentage: Math.round((data.correct / data.total) * 100),
    }))
    .sort((a, b) => {
      if (b.correct !== a.correct) return b.correct - a.correct;
      return b.percentage - a.percentage;
    });

  return results;
}

export function buildResultsText(results) {
  let text = '🏆 <b>Quiz natijalari:</b>\n\n';
  results.forEach((result, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    text += `${medal} <b>${result.name}</b>\n`;
    text += `   ✅ ${result.correct}/${result.total} (${result.percentage}%)\n\n`;
  });
  return text;
}

export function shuffleOptions(question) {
  const correctAnswer = question.correctAnswer;
  const shuffled = shuffleArray([...question.options]);
  const correctAnswerIndex = shuffled.indexOf(correctAnswer);
  const correctLetter = String.fromCharCode(65 + correctAnswerIndex);

  return {
    question: question.question.substring(0, 300), // savol max 300 belgi
    options: shuffled.map(opt => opt.substring(0, 100)), // har variant max 100 belgi
    correctAnswerIndex: correctAnswerIndex,
    correctAnswerLetter: correctLetter,
    correctAnswerText: correctAnswer,
  };
}
