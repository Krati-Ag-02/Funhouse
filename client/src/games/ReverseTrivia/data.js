// Jeopardy-style: player is given the answer, must pick the matching question.
export const bank = [
  {
    category: 'Geography',
    answerShown: 'This is the largest ocean on Earth.',
    correctQuestion: 'What is the Pacific Ocean?',
    options: ['What is the Pacific Ocean?', 'What is the Atlantic Ocean?', 'What is the Indian Ocean?', 'What is the Arctic Ocean?'],
  },
  {
    category: 'Geography',
    answerShown: 'This country is home to the Eiffel Tower.',
    correctQuestion: 'What is France?',
    options: ['What is France?', 'What is Italy?', 'What is Spain?', 'What is Germany?'],
  },
  {
    category: 'Science',
    answerShown: 'This planet is known as the Red Planet.',
    correctQuestion: 'What is Mars?',
    options: ['What is Mars?', 'What is Venus?', 'What is Jupiter?', 'What is Mercury?'],
  },
  {
    category: 'Science',
    answerShown: 'This is the gas plants absorb to make food.',
    correctQuestion: 'What is carbon dioxide?',
    options: ['What is carbon dioxide?', 'What is oxygen?', 'What is nitrogen?', 'What is helium?'],
  },
  {
    category: 'History',
    answerShown: 'This U.S. president appears on the one-dollar bill.',
    correctQuestion: 'Who is George Washington?',
    options: ['Who is George Washington?', 'Who is Abraham Lincoln?', 'Who is Thomas Jefferson?', 'Who is Benjamin Franklin?'],
  },
  {
    category: 'History',
    answerShown: 'This ancient wonder still stands in Giza, Egypt.',
    correctQuestion: 'What is the Great Pyramid?',
    options: ['What is the Great Pyramid?', 'What is the Colosseum?', 'What is the Great Wall?', 'What is Stonehenge?'],
  },
  {
    category: 'Food',
    answerShown: 'This Italian dish is a flat, round bread with toppings.',
    correctQuestion: 'What is pizza?',
    options: ['What is pizza?', 'What is a calzone?', 'What is focaccia?', 'What is bruschetta?'],
  },
  {
    category: 'Food',
    answerShown: 'This yellow fruit is also a slang word for "crazy" in some phrases.',
    correctQuestion: 'What is a banana?',
    options: ['What is a banana?', 'What is a lemon?', 'What is a mango?', 'What is a pineapple?'],
  },
  {
    category: 'Animals',
    answerShown: 'This is the tallest land animal in the world.',
    correctQuestion: 'What is a giraffe?',
    options: ['What is a giraffe?', 'What is an elephant?', 'What is an ostrich?', 'What is a camel?'],
  },
  {
    category: 'Animals',
    answerShown: 'This bird cannot fly but is the fastest runner among birds.',
    correctQuestion: 'What is an ostrich?',
    options: ['What is an ostrich?', 'What is a penguin?', 'What is an emu?', 'What is a peacock?'],
  },
  {
    category: 'Entertainment',
    answerShown: 'This mouse is the mascot of a famous entertainment company.',
    correctQuestion: 'Who is Mickey Mouse?',
    options: ['Who is Mickey Mouse?', 'Who is Jerry?', 'Who is Stuart Little?', 'Who is Mighty Mouse?'],
  },
  {
    category: 'Everyday Life',
    answerShown: 'This is the first meal most people eat in the day.',
    correctQuestion: 'What is breakfast?',
    options: ['What is breakfast?', 'What is lunch?', 'What is brunch?', 'What is dinner?'],
  },
]

export function getRandomCategoryQuestions(excludeAnswers = []) {
  return bank.filter((q) => !excludeAnswers.includes(q.correctQuestion))
}
