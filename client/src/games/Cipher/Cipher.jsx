import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import Confetti from '../../components/Confetti.jsx'
import { buildRound } from './data.js'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './Cipher.css'

const GAME_ID = 'cipher'
const ROUNDS_PER_GAME = 6
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function Cipher() {
  const { user } = useAuth()
  const [difficulty, setDifficulty] = useState('Easy')
  const [round, setRound] = useState(null)
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [roundNum, setRoundNum] = useState(1)
  const [best, setBest] = useState(getBestScore(GAME_ID))
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    resetGame(difficulty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetGame(d = difficulty) {
    setDifficulty(d)
    setScore(0)
    setRoundNum(1)
    setHistory([])
    setGameOver(false)
    setSelected(null)
    setFeedback(null)
    setRound(buildRound(d, []))
  }

  function handleAnswer(option) {
    if (feedback) return
    const isCorrect = option === round.answer
    setSelected(option)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)
  }

  function handleNext() {
    const nextHistory = [...history, round.answer]
    setHistory(nextHistory)

    if (roundNum >= ROUNDS_PER_GAME) {
      setGameOver(true)
      saveScore(GAME_ID, score, user).then((r) => setBest(r.best))
      return
    }
    setRoundNum((n) => n + 1)
    setSelected(null)
    setFeedback(null)
    setRound(buildRound(difficulty, nextHistory))
  }

  if (!round) return null

  return (
    <GameShell gameId="cipher" best={best}>
      {!gameOver && (
        <>
          <div className="ec-toolbar">
            <div className="ec-difficulty" role="tablist" aria-label="Difficulty">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  role="tab"
                  aria-selected={d === difficulty}
                  className={`ec-diff-btn ${d === difficulty ? 'active' : ''}`}
                  onClick={() => resetGame(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="ec-progress">ROUND {roundNum}/{ROUNDS_PER_GAME} · SCORE {score}</div>
          </div>

          <div className="c-readout">
            <div className="c-readout-label">&gt; INCOMING SIGNAL</div>
            <div className="c-encoded">{round.encoded}</div>
          </div>

          <div className="ec-options">
            {round.options.map((opt) => {
              let cls = 'ec-option'
              if (feedback && opt === round.answer) cls += ' correct'
              else if (feedback && opt === selected) cls += ' wrong'
              return (
                <button key={opt} className={cls} onClick={() => handleAnswer(opt)} disabled={!!feedback}>
                  {opt}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className="ec-feedback-row">
              <p className={`ec-feedback ${feedback}`}>
                {feedback === 'correct' ? 'DECODED CORRECTLY' : `SIGNAL LOST — WAS "${round.answer}"`}
              </p>
              <button className="btn-primary" onClick={handleNext}>
                {roundNum >= ROUNDS_PER_GAME ? 'VIEW RESULTS' : 'NEXT SIGNAL →'}
              </button>
            </div>
          )}
        </>
      )}

      {gameOver && (
        <div className="ec-results">
          <Confetti />
          <h2>FINAL SCORE: {score} / {ROUNDS_PER_GAME}</h2>
          <p>BEST ON {difficulty.toUpperCase()}: {best}</p>
          <button className="btn-primary" onClick={() => resetGame(difficulty)}>RUN AGAIN</button>
        </div>
      )}
    </GameShell>
  )
}