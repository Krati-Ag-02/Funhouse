// Local fallback bank — used when Groq isn't configured or is unreachable.
export const facts = [
  { statement: 'A group of flamingos is called a "flamboyance".', isTrue: true, explanation: 'Yes — flocks of flamingos are officially called a flamboyance.' },
  { statement: 'The Great Wall of China is visible from the Moon with the naked eye.', isTrue: false, explanation: "It's not — this is a popular myth; the wall is too narrow to see from that distance." },
  { statement: 'Honey never spoils if stored properly.', isTrue: true, explanation: 'Archaeologists have found edible honey in Egyptian tombs thousands of years old.' },
  { statement: 'Goldfish have a memory span of only three seconds.', isTrue: false, explanation: 'Goldfish can actually remember things for months, not seconds.' },
  { statement: 'Bananas are berries, but strawberries are not.', isTrue: true, explanation: 'Botanically, bananas qualify as berries while strawberries do not.' },
  { statement: 'Lightning never strikes the same place twice.', isTrue: false, explanation: 'Lightning often strikes the same tall structures repeatedly — the Empire State Building is hit dozens of times a year.' },
  { statement: 'Octopuses have three hearts.', isTrue: true, explanation: 'Two pump blood to the gills, and one pumps it to the rest of the body.' },
  { statement: 'Humans only use 10 percent of their brains.', isTrue: false, explanation: 'Brain scans show we use virtually all of our brain, just not all at once.' },
  { statement: 'A day on Venus is longer than a year on Venus.', isTrue: true, explanation: "Venus rotates so slowly that its day is longer than its 225-Earth-day year." },
  { statement: 'Sharks are older than trees.', isTrue: true, explanation: 'Sharks predate trees by roughly 50 million years.' },
]

export function getFactBank() {
  return facts
}
