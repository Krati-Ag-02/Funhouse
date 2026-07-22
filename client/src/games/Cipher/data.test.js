import { describe, it, expect } from 'vitest'
import { buildRound, phrases } from './data.js'

describe('Cipher buildRound', () => {
  it('produces an answer from the requested difficulty pool', () => {
    const round = buildRound('Easy', [])
    expect(phrases.Easy).toContain(round.answer)
  })

  it('includes the correct answer among the options', () => {
    const round = buildRound('Medium', [])
    expect(round.options).toContain(round.answer)
  })

  it('produces exactly 4 unique options', () => {
    const round = buildRound('Hard', [])
    expect(round.options).toHaveLength(4)
    expect(new Set(round.options).size).toBe(4)
  })

  it('encodes the answer differently from the plain text', () => {
    const round = buildRound('Easy', [])
    expect(round.encoded).not.toBe(round.answer)
    // Same length and spacing pattern is preserved by a Caesar shift.
    expect(round.encoded.length).toBe(round.answer.length)
  })

  it('respects excludeAnswers when the pool allows it', () => {
    const allButOne = phrases.Easy.slice(1)
    const round = buildRound('Easy', allButOne)
    expect(round.answer).toBe(phrases.Easy[0])
  })

  it('falls back to the full pool if everything is excluded', () => {
    const round = buildRound('Easy', [...phrases.Easy])
    expect(phrases.Easy).toContain(round.answer)
  })
})
