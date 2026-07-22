import { describe, it, expect } from 'vitest'
import { puzzles, buildOptions } from './data.js'

describe('Word Ladder puzzles', () => {
  it('every puzzle path changes exactly one letter per step', () => {
    for (const puzzle of puzzles) {
      for (let i = 0; i < puzzle.path.length - 1; i++) {
        const a = puzzle.path[i]
        const b = puzzle.path[i + 1]
        expect(a.length).toBe(b.length)
        let diffCount = 0
        for (let j = 0; j < a.length; j++) {
          if (a[j] !== b[j]) diffCount++
        }
        expect(diffCount).toBe(1)
      }
    }
  })

  it('every puzzle path starts and ends at the declared words', () => {
    for (const puzzle of puzzles) {
      expect(puzzle.path[0]).toBe(puzzle.start)
      expect(puzzle.path[puzzle.path.length - 1]).toBe(puzzle.end)
    }
  })
})

describe('buildOptions', () => {
  it('always includes the correct next word', () => {
    const puzzle = puzzles[0]
    const options = buildOptions(puzzle.path, 0)
    expect(options).toContain(puzzle.path[1])
  })

  it('produces 3 total options with no duplicates', () => {
    const puzzle = puzzles[0]
    const options = buildOptions(puzzle.path, 0)
    expect(options).toHaveLength(3)
    expect(new Set(options).size).toBe(3)
  })
})
