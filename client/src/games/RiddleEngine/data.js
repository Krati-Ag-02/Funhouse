// Local fallback bank — used when Groq isn't configured or is unreachable.
export const riddles = [
  {
    riddle: 'The more you take, the more you leave behind. What am I?',
    answer: 'Footsteps',
    options: ['Footsteps', 'Shadows', 'Memories', 'Time'],
  },
  {
    riddle: 'I have keys but no locks, space but no room. You can enter but not go outside. What am I?',
    answer: 'A keyboard',
    options: ['A keyboard', 'A piano', 'A house', 'A map'],
  },
  {
    riddle: 'What has to be broken before you can use it?',
    answer: 'An egg',
    options: ['An egg', 'A promise', 'A record', 'A seal'],
  },
  {
    riddle: 'I am tall when I am young, and short when I am old. What am I?',
    answer: 'A candle',
    options: ['A candle', 'A tree', 'A person', 'A shadow'],
  },
  {
    riddle: 'What can travel around the world while staying in a corner?',
    answer: 'A stamp',
    options: ['A stamp', 'A spider', 'A letter', 'A coin'],
  },
  {
    riddle: 'The more you remove from me, the bigger I get. What am I?',
    answer: 'A hole',
    options: ['A hole', 'A balloon', 'A debt', 'A shadow'],
  },
  {
    riddle: 'What has a face and two hands but no arms or legs?',
    answer: 'A clock',
    options: ['A clock', 'A doll', 'A statue', 'A card'],
  },
  {
    riddle: 'What gets wetter the more it dries?',
    answer: 'A towel',
    options: ['A towel', 'The rain', 'A sponge', 'The sea'],
  },
]

export function getRiddleBank() {
  return riddles
}
