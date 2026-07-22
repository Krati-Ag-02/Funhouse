import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveScore, getBestScore } from './scoreService.js'

// The backend sync inside saveScore is best-effort — stub fetch so
// tests run offline and only exercise the localStorage behavior.
beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline in tests'))))
})

describe('scoreService', () => {
  it('returns 0 for a game with no saved score', () => {
    expect(getBestScore('never-played')).toBe(0)
  })

  it('saves a score and reports it as the best', async () => {
    const result = await saveScore('cipher', 5)
    expect(result.best).toBe(5)
    expect(getBestScore('cipher')).toBe(5)
  })

  it('keeps the higher of two scores as the best', async () => {
    await saveScore('cipher', 5)
    await saveScore('cipher', 3)
    expect(getBestScore('cipher')).toBe(5)

    await saveScore('cipher', 9)
    expect(getBestScore('cipher')).toBe(9)
  })

  it('tracks scores per game independently', async () => {
    await saveScore('cipher', 5)
    await saveScore('riddle-engine', 2)
    expect(getBestScore('cipher')).toBe(5)
    expect(getBestScore('riddle-engine')).toBe(2)
  })
})
