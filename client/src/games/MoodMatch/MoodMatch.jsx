import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import Confetti from '../../components/Confetti.jsx'
import { getMoodRound } from '../../services/aiClient.js'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './MoodMatch.css'

const GAME_ID = 'mood-match'
const ROUNDS_PER_GAME = 6

export default function MoodMatch() {
  const { user } = useAuth()
  const [round, setRound] = useState(null)
  const [seenIds, setSeenIds] = useState([])
  const [seenTexts, setSeenTexts] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [roundNum, setRoundNum] = useState(1)
  const [best, setBest] = useState(getBestScore(GAME_ID))
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    resetGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resetGame() {
    setScore(0)
    setRoundNum(1)
    setSeenIds([])
    setSeenTexts([])
    setGameOver(false)
    getMoodRound([], []).then((r) => {
      setRound(r)
      setSelected(null)
      setFeedback(null)
    })
  }

  function handleAnswer(emoji) {
    if (feedback) return
    const isCorrect = emoji === round.best
    setSelected(emoji)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)
  }

  async function handleNext() {
    const nextSeenIds = [...seenIds, round.id]
    const nextSeenTexts = [...seenTexts, round.text]
    setSeenIds(nextSeenIds)
    setSeenTexts(nextSeenTexts)

    if (roundNum >= ROUNDS_PER_GAME) {
      setGameOver(true)
      const result = await saveScore(GAME_ID, score, user)
      setBest(result.best)
      return
    }
    setRoundNum((n) => n + 1)
    const r = await getMoodRound(nextSeenIds, nextSeenTexts)
    setRound(r)
    setSelected(null)
    setFeedback(null)
  }

  if (!round) return null

  return (
    <GameShell gameId="mood-match" best={best}>
      {!gameOver && (
        <>
          <div className="ec-toolbar">
            <span className="label-mono">{round.source === 'groq' ? 'live round' : 'archive round'}</span>
            <div className="ec-progress">Round {roundNum} of {ROUNDS_PER_GAME} · Score {score}</div>
          </div>

          <div className="mo-stage">{round.text}</div>

          <div className="mo-options">
            {round.options.map((emoji) => {
              let cls = 'mo-mask'
              if (feedback && emoji === round.best) cls += ' correct'
              else if (feedback && emoji === selected) cls += ' wrong'
              return (
                <button
                  key={emoji}
                  className={cls}
                  onClick={() => handleAnswer(emoji)}
                  disabled={!!feedback}
                  aria-label={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className="ec-feedback-row">
              <p className={`ec-feedback ${feedback}`}>
                {feedback === 'correct' ? 'That fits perfectly!' : `Close! ${round.best} was the best match here`}
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