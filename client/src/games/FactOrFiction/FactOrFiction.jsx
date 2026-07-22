import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import { getFactRound } from '../../services/aiClient.js'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './FactOrFiction.css'

const GAME_ID = 'fact-or-fiction'
const ROUNDS_PER_GAME = 8

export default function FactOrFiction() {
  const { user } = useAuth()
  const [round, setRound] = useState(null)
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [roundNum, setRoundNum] = useState(1)
  const [best, setBest] = useState(getBestScore(GAME_ID))
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => { resetGame() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function resetGame() {
    setScore(0)
    setRoundNum(1)
    setHistory([])
    setGameOver(false)
    getFactRound([]).then((r) => { setRound(r); setSelected(null); setFeedback(null) })
  }

  function handleAnswer(choice) {
    if (feedback) return
    const isCorrect = choice === round.isTrue
    setSelected(choice)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)
  }

  async function handleNext() {
    const nextHistory = [...history, round.statement]
    setHistory(nextHistory)

    if (roundNum >= ROUNDS_PER_GAME) {
      setGameOver(true)
      const result = await saveScore(GAME_ID, score, user)
      setBest(result.best)
      return
    }
    setRoundNum((n) => n + 1)
    const r = await getFactRound(nextHistory)
    setRound(r)
    setSelected(null)
    setFeedback(null)
  }

  if (!round) return null

  return (
    <GameShell gameId="fact-or-fiction" best={best}>
      {!gameOver && (
        <>
          <div className="ec-toolbar">
            <span className="label-mono">{round.source === 'groq' ? 'live round' : 'archive round'}</span>
            <div className="ec-progress">Round {roundNum} of {ROUNDS_PER_GAME} · Score {score}</div>
          </div>

          <div className="statement-panel" style={{ textAlign: 'center' }}>{round.statement}</div>

          <div className="ff-options">
            <button
              className={`ff-choice true ${feedback && round.isTrue === true ? 'correct' : ''} ${feedback && selected === true && !round.isTrue ? 'wrong' : ''}`}
              onClick={() => handleAnswer(true)}
              disabled={!!feedback}
            >
              FACT
            </button>
            <button
              className={`ff-choice false ${feedback && round.isTrue === false ? 'correct' : ''} ${feedback && selected === false && round.isTrue ? 'wrong' : ''}`}
              onClick={() => handleAnswer(false)}
              disabled={!!feedback}
            >
              FICTION
            </button>
          </div>

          {feedback && (
            <div className="ec-feedback-row">
              <p className={`ec-feedback ${feedback}`}>{round.explanation}</p>
              <button className="btn-primary" onClick={handleNext}>
                {roundNum >= ROUNDS_PER_GAME ? 'See results' : 'Next round →'}
              </button>
            </div>
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
