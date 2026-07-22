import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './MemoryMatch.css'

const GAME_ID = 'memory-match'
const ICON_SET = ['🍎', '🐶', '🌙', '⭐', '🎈', '🍕', '🚗', '🐢', '🌻', '⚽']

function buildDeck(pairCount) {
  const icons = ICON_SET.slice(0, pairCount)
  const deck = [...icons, ...icons]
    .map((icon, i) => ({ id: `${icon}-${i}`, icon }))
    .sort(() => Math.random() - 0.5)
  return deck
}

const LEVELS = {
  Calm: 6,   // 6 pairs = 12 cards — good for younger kids or a relaxed pace
  Classic: 8,
}

export default function MemoryMatch() {
  const { user } = useAuth()
  const [level, setLevel] = useState('Calm')
  const [deck, setDeck] = useState(() => buildDeck(LEVELS.Calm))
  const [flipped, setFlipped] = useState([]) // indices currently face-up (max 2)
  const [matched, setMatched] = useState([]) // indices already matched
  const [moves, setMoves] = useState(0)
  const [best, setBest] = useState(getBestScore(GAME_ID))
  const [won, setWon] = useState(false)

  function newGame(nextLevel = level) {
    setLevel(nextLevel)
    setDeck(buildDeck(LEVELS[nextLevel]))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setWon(false)
  }

  function handleFlip(index) {
    if (flipped.length === 2) return
    if (flipped.includes(index) || matched.includes(index)) return

    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      const newMoves = moves + 1
      setMoves(newMoves)
      const [a, b] = nextFlipped
      if (deck[a].icon === deck[b].icon) {
        const nextMatched = [...matched, a, b]
        setTimeout(() => {
          setMatched(nextMatched)
          setFlipped([])
          if (nextMatched.length === deck.length) finishGame(newMoves)
        }, 500)
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  async function finishGame(finalMoves) {
    setWon(true)
    // Fewer moves = better; convert to a simple score (higher is better).
    const perfect = deck.length / 2
    const score = Math.max(0, 100 - (finalMoves - perfect) * 5)
    const result = await saveScore(GAME_ID, score, user)
    setBest(result.best)
  }

  return (
    <GameShell gameId="memory-match" best={best}>
      <div className="ec-toolbar">
        <div className="ec-difficulty" role="tablist" aria-label="Board size">
          {Object.keys(LEVELS).map((lvl) => (
            <button
              key={lvl}
              className={`ec-diff-btn ${lvl === level ? 'active' : ''}`}
              onClick={() => newGame(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
        <div className="ec-progress">Moves: {moves}</div>
      </div>

      <div
        className="mm-grid"
        style={{ gridTemplateColumns: `repeat(${deck.length <= 12 ? 4 : 4}, 1fr)` }}
      >
        {deck.map((card, i) => {
          const isUp = flipped.includes(i) || matched.includes(i)
          return (
            <button
              key={card.id}
              className={`mm-card ${isUp ? 'up' : ''} ${matched.includes(i) ? 'matched' : ''}`}
              onClick={() => handleFlip(i)}
              aria-label={isUp ? card.icon : 'hidden card'}
            >
              {isUp ? card.icon : '❔'}
            </button>
          )
        })}
      </div>

      {won && (
        <div className="ec-results">
          <h2>Solved in {moves} moves!</h2>
          <p>Best score: {best}</p>
          <button className="btn-primary" onClick={() => newGame(level)}>Play again</button>
        </div>
      )}
    </GameShell>
  )
}
