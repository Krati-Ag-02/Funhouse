import { useEffect, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import { getStoryRound } from '../../services/aiClient.js'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './StoryBranch.css'

const GAME_ID = 'story-branch'
const ROUNDS_PER_GAME = 5
const QUALITY_POINTS = { best: 2, good: 1, poor: 0 }

export default function StoryBranch() {
  const { user } = useAuth()
  const [round, setRound] = useState(null)
  const [history, setHistory] = useState([])
  const [chosen, setChosen] = useState(null)
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
    getStoryRound([]).then((r) => { setRound(r); setChosen(null) })
  }

  function handleChoice(choice) {
    if (chosen) return
    setChosen(choice)
    setScore((s) => s + (QUALITY_POINTS[choice.quality] ?? 0))
  }

  async function handleNext() {
    const nextHistory = [...history, round.scenario]
    setHistory(nextHistory)

    if (roundNum >= ROUNDS_PER_GAME) {
      setGameOver(true)
      const result = await saveScore(GAME_ID, score, user)
      setBest(result.best)
      return
    }
    setRoundNum((n) => n + 1)
    const r = await getStoryRound(nextHistory)
    setRound(r)
    setChosen(null)
  }

  if (!round) return null

  return (
    <GameShell gameId="story-branch" best={best}>
      {!gameOver && (
        <>
          <div className="ec-toolbar">
            <span className="label-mono">{round.source === 'groq' ? 'live scenario' : 'archive scenario'}</span>
            <div className="ec-progress">Scene {roundNum} of {ROUNDS_PER_GAME} · Score {score}</div>
          </div>

          <div className="statement-panel">{round.scenario}</div>

          <div className="sb-choices">
            {round.choices.map((choice) => {
              const isChosen = chosen?.id === choice.id
              return (
                <button
                  key={choice.id}
                  className={`sb-choice ${chosen ? (isChosen ? `picked-${choice.quality}` : 'faded') : ''}`}
                  onClick={() => handleChoice(choice)}
                  disabled={!!chosen}
                >
                  {choice.text}
                </button>
              )
            })}
          </div>

          {chosen && (
            <div className="ec-feedback-row">
              <p className="sb-outcome">{chosen.outcome}</p>
              <button className="btn-primary" onClick={handleNext}>
                {roundNum >= ROUNDS_PER_GAME ? 'See results' : 'Next scene →'}
              </button>
            </div>
          )}
        </>
      )}

      {gameOver && (
        <div className="ec-results">
          <h2>Final score: {score} / {ROUNDS_PER_GAME * 2}</h2>
          <p>Best score: {best}</p>
          <button className="btn-primary" onClick={resetGame}>Play again</button>
        </div>
      )}
    </GameShell>
  )
}
