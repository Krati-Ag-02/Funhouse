// A rotation (Caesar-shift) decoding game. Player sees scrambled text
// and picks the correctly decoded phrase from options — no typing
// required, so it stays fast and frustration-free for any age.
export const phrases = {
  Easy: ['HELLO WORLD', 'GOOD MORNING', 'HAVE A NICE DAY', 'THANK YOU', 'WELL DONE'],
  Medium: ['THE EARLY BIRD', 'PRACTICE MAKES PERFECT', 'BETTER LATE THAN NEVER', 'ACTIONS SPEAK LOUDLY', 'KNOWLEDGE IS POWER'],
  Hard: ['FORTUNE FAVORS THE BOLD', 'CURIOSITY NEVER HURT ANYONE', 'PATIENCE IS A VIRTUE INDEED', 'EVERY CLOUD HAS A SILVER LINING', 'ROME WAS NOT BUILT IN A DAY'],
}

function shift(text, amount) {
  return text
    .split('')
    .map((ch) => {
      if (ch === ' ') return ' '
      const code = ch.charCodeAt(0) - 65
      return String.fromCharCode(((code + amount + 26) % 26) + 65)
    })
    .join('')
}

export function buildRound(difficulty, excludeAnswers = []) {
  const all = phrases[difficulty]
  const pool = all.filter((p) => !excludeAnswers.includes(p))
  const source = pool.length ? pool : all
  const answer = source[Math.floor(Math.random() * source.length)]
  const shiftAmount = 1 + Math.floor(Math.random() * 25)
  const encoded = shift(answer, shiftAmount)

  // Decoys are other real phrases from the same difficulty pool.
  const others = all.filter((p) => p !== answer)
  const decoys = []
  while (decoys.length < 3 && others.length) {
    const idx = Math.floor(Math.random() * others.length)
    const pick = others.splice(idx, 1)[0]
    decoys.push(pick)
  }

  const options = [answer, ...decoys].sort(() => Math.random() - 0.5)
  return { encoded, answer, options, shiftAmount }
}
