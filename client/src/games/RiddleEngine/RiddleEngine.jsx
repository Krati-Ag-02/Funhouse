import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import Confetti from '../../components/Confetti.jsx'
import { getRiddleRound } from '../../services/aiClient.js'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './RiddleEngine.css'

const GAME_ID = 'riddle-engine'
const ROUNDS_PER_GAME = 6

export default function RiddleEngine() {
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
    getRiddleRound([]).then((r) => { setRound(r); setSelected(null); setFeedback(null) })
  }

  function handleAnswer(option) {
    if (feedback) return
    const isCorrect = option === round.answer
    setSelected(option)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)
  }

  async function handleNext() {
    const nextHistory = [...history, round.answer]
    setHistory(nextHistory)

    if (roundNum >= ROUNDS_PER_GAME) {
      setGameOver(true)
      const result = await saveScore(GAME_ID, score, user)
      setBest(result.best)
      return
    }
    setRoundNum((n) => n + 1)
    const r = await getRiddleRound(nextHistory)
    setRound(r)
    setSelected(null)
    setFeedback(null)
  }

  if (!round) return null

  return (
    <GameShell gameId="riddle-engine" best={best}>
      {!gameOver && (
        <>
          <div className="ec-toolbar">
            <span className="label-mono">{round.source === 'groq' ? 'live round' : 'archive round'}</span>
            <div className="ec-progress">Round {roundNum} of {ROUNDS_PER_GAME} · Score {score}</div>
          </div>

          <div className="rd-scroll">
            <span className="rd-riddle-label">a riddle unfurls</span>
            {round.riddle}
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
                {feedback === 'correct' ? 'Correct!' : `Not quite — it was "${round.answer}"`}
              </p>
              <button className="btn-primary" onClick={handleNext}>
                {roundNum >= ROUNDS_PER_GAME ? 'See results' : 'Next round →'}
              </button>
            </div>
          )}
        </>
      )}

      {gameOver && (
        <div className="ec-results">
          <Confetti />
          <h2>Final score: {score} / {ROUNDS_PER_GAME}</h2>
          <p>Best score: {best}</p>
          <button className="btn-primary" onClick={resetGame}>Play again</button>
        </div>
      )}
    </GameShell>
  )
}