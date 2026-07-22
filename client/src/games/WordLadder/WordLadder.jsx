import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import Confetti from '../../components/Confetti.jsx'
import { puzzles, buildOptions } from './data.js'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './WordLadder.css'

const GAME_ID = 'word-ladder'

function pickPuzzle(excludeStarts = []) {
  const pool = puzzles.filter((p) => !excludeStarts.includes(p.start))
  const source = pool.length ? pool : puzzles
  return source[Math.floor(Math.random() * source.length)]
}

export default function WordLadder() {
  const { user } = useAuth()
  const [puzzle, setPuzzle] = useState(null)
  const [solvedChain, setSolvedChain] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [wrongCount, setWrongCount] = useState(0)
  const [best, setBest] = useState(getBestScore(GAME_ID))
  const [completedCount, setCompletedCount] = useState(0)
  const [seenStarts, setSeenStarts] = useState([])
  const [celebrate, setCelebrate] = useState(0)

  useEffect(() => { newPuzzle([]) }, [])

  function newPuzzle(excludeStarts) {
    const p = pickPuzzle(excludeStarts)
    setPuzzle(p)
    setSolvedChain([p.start])
    setStepIndex(0)
    setOptions(buildOptions(p.path, 0))
    setSelected(null)
    setFeedback(null)
    setWrongCount(0)
  }

  function handleChoice(word) {
    if (feedback) return
    const correct = word === puzzle.path[stepIndex + 1]
    setSelected(word)
    setFeedback(correct ? 'correct' : 'wrong')
    if (!correct) setWrongCount((w) => w + 1)
  }

  async function handleNext() {
    if (feedback === 'wrong') {
      setOptions(buildOptions(puzzle.path, stepIndex))
      setSelected(null)
      setFeedback(null)
      return
    }

    const nextChain = [...solvedChain, puzzle.path[stepIndex + 1]]
    setSolvedChain(nextChain)

    if (stepIndex + 2 >= puzzle.path.length) {
      const puzzleScore = Math.max(10, 100 - wrongCount * 10)
      const newTotal = completedCount + 1
      setCompletedCount(newTotal)
      setCelebrate((c) => c + 1)
      const result = await saveScore(GAME_ID, puzzleScore, user)
      setBest(result.best)

      const nextSeen = [...seenStarts, puzzle.start]
      setSeenStarts(nextSeen)
      setTimeout(() => newPuzzle(nextSeen), 900)
      return
    }

    const nextStep = stepIndex + 1
    setStepIndex(nextStep)
    setOptions(buildOptions(puzzle.path, nextStep))
    setSelected(null)
    setFeedback(null)
  }

  if (!puzzle) return null

  return (
    <GameShell gameId="word-ladder" best={best}>
      {celebrate > 0 && <Confetti key={celebrate} count={20} />}

      <div className="ec-toolbar">
        <p className="st-instructions">
          Change one letter at a time to climb from <strong>{puzzle.start}</strong> to <strong>{puzzle.end}</strong>.
        </p>
        <div className="ec-progress">SOLVED {completedCount}</div>
      </div>

      <div className="wl-chain">
        {solvedChain.map((w, i) => (
          <span key={i} className="wl-chip solved">{w}</span>
        ))}
        <span className="wl-chip target">{puzzle.end}</span>
      </div>

      <div className="ec-options" style={{ marginTop: '1.75rem' }}>
        {options.map((opt) => {
          let cls = 'ec-option'
          if (feedback && opt === puzzle.path[stepIndex + 1]) cls += ' correct'
          else if (feedback && opt === selected) cls += ' wrong'
          return (
            <button key={opt} className={cls} onClick={() => handleChoice(opt)} disabled={!!feedback}>
              {opt}
            </button>
          )
        })}
      </div>

      {feedback && (
        <div className="ec-feedback-row">
          <p className={`ec-feedback ${feedback}`}>
            {feedback === 'correct' ? 'ONE STEP CLOSER' : 'NOT A VALID STEP — TRY AGAIN'}
          </p>
          <button className="btn-primary" onClick={handleNext}>
            {feedback === 'wrong' ? 'RETRY STEP' : 'CONTINUE →'}
          </button>
        </div>
      )}
    </GameShell>
  )
}