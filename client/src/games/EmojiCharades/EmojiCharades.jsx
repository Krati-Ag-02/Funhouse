import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import Confetti from '../../components/Confetti.jsx'
import { getEmojiRound } from '../../services/aiClient.js'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './EmojiCharades.css'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const GAME_ID = 'emoji-charades'
const ROUNDS_PER_GAME = 8

export default function EmojiCharades() {
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

  async function loadRound(nextHistory = history) {
    const next = await getEmojiRound(difficulty, nextHistory)
    setRound(next)
    setSelected(null)
    setFeedback(null)
  }

  useEffect(() => {
    resetGame(difficulty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty])

  function resetGame(d = difficulty) {
    setScore(0)
    setRoundNum(1)
    setHistory([])
    setGameOver(false)
    setDifficulty(d)
    getEmojiRound(d, []).then((r) => {
      setRound(r)
      setSelected(null)
      setFeedback(null)
    })
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
    await loadRound(nextHistory)
  }

  if (!round) return null

  return (
    <GameShell gameId="emoji-charades" best={best}>
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
            <div className="ec-progress">Round {roundNum} of {ROUNDS_PER_GAME} · Score {score}</div>
          </div>

          <span className="label-mono">{round.source === 'groq' ? 'live round' : 'archive round'}</span>
          <div className="em-orb" aria-label={`Emoji clue: ${round.emojis}`}>
            <span>{round.emojis}</span>
          </div>

          <div className="ec-options">
            {round.options.map((opt) => {
              let cls = 'ec-option'
              if (feedback && opt === round.answer) cls += ' correct'
              else if (feedback && opt === selected) cls += ' wrong'
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className="ec-feedback-row">
              <p className={`ec-feedback ${feedback}`}>
                {feedback === 'correct' ? "That's it! 🎉" : `Not quite — it was "${round.answer}"`}
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
          <p>Best on {difficulty}: {best}</p>
          <button className="btn-primary" onClick={() => resetGame(difficulty)}>Play again</button>
        </div>
      )}
    </GameShell>
  )
}