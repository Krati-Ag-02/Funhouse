import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './ColorDeception.css'

const GAME_ID = 'color-deception'
const ROUNDS_PER_GAME = 10
const COLORS = [
  { name: 'Red', hex: '#E5484D' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#2EC4B6' },
  { name: 'Yellow', hex: '#FFC857' },
  { name: 'Purple', hex: '#8B5CF6' },
]

function randomRound() {
  const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  let inkColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  // Bias toward mismatched word/ink so the game has a point, but allow
  // an occasional match to keep players from just ignoring the word.
  if (Math.random() > 0.15) {
    while (inkColor.name === wordColor.name) {
      inkColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    }
  }
  return { word: wordColor.name, ink: inkColor }
}

export default function ColorDeception() {
  const { user } = useAuth()
  const [round, setRound] = useState(randomRound())
  const [score, setScore] = useState(0)
  const [roundNum, setRoundNum] = useState(1)
  const [feedback, setFeedback] = useState(null)
  const [best, setBest] = useState(getBestScore(GAME_ID))
  const [gameOver, setGameOver] = useState(false)

  function resetGame() {
    setScore(0)
    setRoundNum(1)
    setGameOver(false)
    setFeedback(null)
    setRound(randomRound())
  }

  function handleAnswer(colorName) {
    if (feedback) return
    const isCorrect = colorName === round.ink.name
    const newScore = score + (isCorrect ? 1 : 0)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setScore(newScore)

    setTimeout(async () => {
      if (roundNum >= ROUNDS_PER_GAME) {
        setGameOver(true)
        const result = await saveScore(GAME_ID, newScore, user)
        setBest(result.best)
        return
      }
      setRoundNum((n) => n + 1)
      setFeedback(null)
      setRound(randomRound())
    }, 500)
  }

  return (
    <GameShell gameId="color-deception" best={best}>
      {!gameOver && (
        <>
          <div className="ec-toolbar" style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0, color: 'var(--text-dim)' }}>
              Tap the button matching the <strong>ink color</strong> of the word below — not what it says.
            </p>
            <div className="ec-progress">Round {roundNum} of {ROUNDS_PER_GAME} · Score {score}</div>
          </div>

          <div className="cd-word-display">
            <span style={{ color: round.ink.hex }}>{round.word}</span>
          </div>

          <div className="cd-options">
            {COLORS.map((c) => (
              <button
                key={c.name}
                className="cd-swatch"
                style={{ background: c.hex }}
                onClick={() => handleAnswer(c.name)}
                disabled={!!feedback}
                aria-label={c.name}
              />
            ))}
          </div>

          {feedback && (
            <p className={`ec-feedback ${feedback}`} style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              {feedback === 'correct' ? 'Nice catch!' : `It was ${round.ink.name}`}
            </p>
          )}
        </>
      )}

      {gameOver && (
        <div className="ec-results">
          <h2>Final score: {score} / {ROUNDS_PER_GAME}</h2>
          <p>Best score: {best}</p>
          <button className="btn-primary" onClick={resetGame}>Play again</button>
        </div>
      )}
    </GameShell>
  )
}
