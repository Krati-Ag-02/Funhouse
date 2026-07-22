// Each puzzle has a fixed shortest path from start to end, changing
// one letter at a time. The player picks the next word from a
// multiple-choice list at each step (no typing required).
export const puzzles = [
  {
    start: 'COLD',
    end: 'WARM',
    path: ['COLD', 'CORD', 'CARD', 'WARD', 'WARM'],
  },
  {
    start: 'CAT',
    end: 'DOG',
    path: ['CAT', 'COT', 'COG', 'DOG'],
  },
  {
    start: 'HEAD',
    end: 'TAIL',
    path: ['HEAD', 'HEAL', 'TEAL', 'TELL', 'TALL', 'TAIL'],
  },
  {
    start: 'HATE',
    end: 'LOVE',
    path: ['HATE', 'HAVE', 'HIVE', 'LIVE', 'LOVE'],
  },
  {
    start: 'GOLD',
    end: 'COAT',
    path: ['GOLD', 'BOLD', 'BOLT', 'BOAT', 'COAT'],
  },
]

// Generates, for each step, a set of plausible options (the correct
// next word plus decoys that change one letter but lead nowhere useful).
export function buildOptions(path, stepIndex) {
  const current = path[stepIndex]
  const correct = path[stepIndex + 1]
  const decoys = new Set()
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let attempts = 0

  while (decoys.size < 2 && attempts < 50) {
    attempts++
    const pos = Math.floor(Math.random() * current.length)
    const letter = letters[Math.floor(Math.random() * letters.length)]
    const candidate = current.slice(0, pos) + letter + current.slice(pos + 1)
    if (candidate !== correct && candidate !== current) decoys.add(candidate)
  }

  return [correct, ...decoys].sort(() => Math.random() - 0.5)
}
