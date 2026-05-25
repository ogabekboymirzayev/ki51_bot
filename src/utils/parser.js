import fs from 'fs';

export function parseQuestions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const questionBlocks = content.split('+++++').map(q => q.trim()).filter(q => q);

  return questionBlocks.map(block => {
    const parts = block.split(/={4,}/).map(p => p.trim()).filter(p => p);
    if (parts.length < 2) return null;

    const question = parts[0];
    const options = parts.slice(1);

    return {
      question,
      options,
      correctAnswer: options[0],
    };
  }).filter(q => q !== null);
}
