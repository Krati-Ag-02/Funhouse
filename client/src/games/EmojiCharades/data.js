// Local question bank so the game works with zero setup.
// Swap `getRound()` in aiClient.js for a real API later without
// touching the game component at all.
export const bank = [
  // Easy — well-known movies & simple phrases
  { emojis: '🦁👑', answer: 'The Lion King', options: ['The Lion King', 'Madagascar', 'Zootopia', 'Jungle Book'], difficulty: 'Easy' },
  { emojis: '🕷️👨', answer: 'Spider-Man', options: ['Spider-Man', 'Batman', 'Iron Man', 'The Fly'], difficulty: 'Easy' },
  { emojis: '❄️👸', answer: 'Frozen', options: ['Frozen', 'Ice Age', 'Cinderella', 'Snow White'], difficulty: 'Easy' },
  { emojis: '🐟🔍', answer: 'Finding Nemo', options: ['Finding Nemo', 'Shark Tale', 'Moana', 'The Little Mermaid'], difficulty: 'Easy' },
  { emojis: '🏠🎈', answer: 'Up', options: ['Up', 'Balloon Boy', 'The Wizard of Oz', 'Coco'], difficulty: 'Easy' },
  { emojis: '🍫🏭', answer: 'Charlie and the Chocolate Factory', options: ['Charlie and the Chocolate Factory', 'Willy Wonka', 'Candyland', 'Hansel and Gretel'], difficulty: 'Easy' },
  { emojis: '🐭🧀', answer: 'Ratatouille', options: ['Ratatouille', 'Tom and Jerry', 'Cinderella', 'Stuart Little'], difficulty: 'Easy' },
  { emojis: '🌧️☂️', answer: "It's raining cats and dogs", options: ["It's raining cats and dogs", 'Singing in the rain', 'A storm is coming', 'April showers'], difficulty: 'Easy' },

  // Medium — idioms & slightly less obvious titles
  { emojis: '🍰🎂😢', answer: 'Piece of cake gone wrong', options: ['Piece of cake gone wrong', 'A recipe for disaster', 'Let them eat cake', 'Happy birthday'], difficulty: 'Medium' },
  { emojis: '🌙🚶', answer: 'Moonwalk', options: ['Moonwalk', 'Sleepwalking', 'Once in a blue moon', 'Man on the Moon'], difficulty: 'Medium' },
  { emojis: '🐝🧠', answer: 'Bee in your bonnet', options: ['Bee in your bonnet', 'Busy as a bee', 'Brain freeze', 'Spelling bee'], difficulty: 'Medium' },
  { emojis: '🦋🐛', answer: 'Ugly duckling story', options: ['Ugly duckling story', 'Metamorphosis', 'Caterpillar to butterfly', 'A late bloomer'], difficulty: 'Medium' },
  { emojis: '🕰️💰', answer: 'Time is money', options: ['Time is money', 'A stitch in time', 'Money never sleeps', "Time's up"], difficulty: 'Medium' },
  { emojis: '🐘🏠', answer: 'Elephant in the room', options: ['Elephant in the room', 'A whale of a house', 'Dumbo', 'Home is where the heart is'], difficulty: 'Medium' },
  { emojis: '🌊🍾', answer: 'Message in a bottle', options: ['Message in a bottle', 'Smooth sailing', 'A drop in the ocean', 'Sink or swim'], difficulty: 'Medium' },
  { emojis: '🔑🚪', answer: 'Key to success', options: ['Key to success', 'When one door closes', 'Locked out', 'Open sesame'], difficulty: 'Medium' },

  // Hard — trickier idioms & wordplay
  { emojis: '🐍🛢️', answer: 'Snake oil', options: ['Snake oil', 'Slippery when wet', 'Oil and water', 'A can of worms'], difficulty: 'Hard' },
  { emojis: '🥧☁️', answer: 'Pie in the sky', options: ['Pie in the sky', 'Head in the clouds', 'A slice of heaven', 'Cloud nine'], difficulty: 'Hard' },
  { emojis: '🐐🎭', answer: 'Scapegoat', options: ['Scapegoat', 'Greatest of all time', 'Drama queen', 'Goat rodeo'], difficulty: 'Hard' },
  { emojis: '🦢🎤', answer: 'Swan song', options: ['Swan song', 'Ugly duckling', 'The last dance', 'Voice of an angel'], difficulty: 'Hard' },
  { emojis: '🌰🔨', answer: 'A tough nut to crack', options: ['A tough nut to crack', 'Hit the nail on the head', 'Squirreling away', 'Cracking under pressure'], difficulty: 'Hard' },
  { emojis: '🐢🏁', answer: 'Slow and steady wins the race', options: ['Slow and steady wins the race', 'The tortoise and the hare', 'Race against time', 'Finish line'], difficulty: 'Hard' },
  { emojis: '🕯️🏮', answer: 'Burning the candle at both ends', options: ['Burning the candle at both ends', 'Light at the end of the tunnel', 'A candle in the wind', 'Out like a light'], difficulty: 'Hard' },
  { emojis: '🐦🪱', answer: 'The early bird catches the worm', options: ['The early bird catches the worm', 'Birds of a feather', 'A bird in the hand', 'Kill two birds with one stone'], difficulty: 'Hard' },
]

export function getRoundsByDifficulty(difficulty) {
  return bank.filter((q) => q.difficulty === difficulty)
}
