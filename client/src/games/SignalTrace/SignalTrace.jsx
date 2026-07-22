import { useCallback, useEffect, useRef, useState } from 'react'
import GameShell from '../../components/GameShell.jsx'
import Confetti from '../../components/Confetti.jsx'
import { saveScore, getBestScore } from '../../services/scoreService.js'
import { useAuth } from '../../services/AuthContext.jsx'
import '../../styles/quiz-shared.css'
import './SignalTrace.css'

const GAME_ID = 'signal-trace'
const PADS = [
  { id: 0, color: '#8F79C9', freq: 329.6 },
  { id: 1, color: '#3FA98A', freq: 392.0 },
  { id: 2, color: '#C9678A', freq: 440.0 },
  { id: 3, color: '#D6A24C', freq: 523.3 },
]

function useBeep() {
  const ctxRef = useRef(null)
  return useCallback((freq, duration = 220) => {
    try {
      if (!ctxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        ctxRef.current = new AudioCtx()
      }
      const ctx = ctxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration / 1000)
    } catch {
      // Web Audio unavailable — game still works silently
    }
  }, [])
}

export default function SignalTrace() {
  const { user } = useAuth()
  const [sequence, setSequence] = useState([])
  const [playerStep, setPlayerStep] = useState(0)
  const [activePad, setActivePad] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | playing | input | lost
  const [best, setBest] = useState(getBestScore(GAME_ID))
  const [celebrate, setCelebrate] = useState(0)
  const beep = useBeep()

  const level = sequence.length

  function startGame() {
    const first = [Math.floor(Math.random() * PADS.length)]
    setSequence(first)
    setPlayerStep(0)
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    let cancelled = false

    async function playSequence() {
      for (let i = 0; i < sequence.length; i++) {
        if (cancelled) return
        await new Promise((r) => setTimeout(r, 420))
        setActivePad(sequence[i])
        beep(PADS[sequence[i]].freq)
        await new Promise((r) => setTimeout(r, 320))
        setActivePad(null)
      }
      if (!cancelled) setPhase('input')
    }

    playSequence()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sequence])

  async function handlePadClick(padId) {
    if (phase !== 'input') return
    setActivePad(padId)
    beep(PADS[padId].freq, 150)
    setTimeout(() => setActivePad(null), 150)

    const expected = sequence[playerStep]
    if (padId !== expected) {
      setPhase('lost')
      const result = await saveScore(GAME_ID, level, user)
      setBest(result.best)
      return
    }

    if (playerStep + 1 === sequence.length) {
      setCelebrate((c) => c + 1)
      setTimeout(() => {
        setSequence((s) => [...s, Math.floor(Math.random() * PADS.length)])
        setPlayerStep(0)
        setPhase('playing')
      }, 500)
    } else {
      setPlayerStep((s) => s + 1)
    }
  }

  return (
    <GameShell gameId="signal-trace" best={best}>
      <div className="st-toolbar">
        <p className="st-instructions">Watch the constellation light up, then trace it back. Each round adds one more star.</p>
        <div className="ec-progress">LEVEL {level}</div>
      </div>

      <div className="st-sky">
        {celebrate > 0 && <Confetti key={celebrate} count={14} />}
        <div className="st-grid">
          {PADS.map((pad) => (
            <button
              key={pad.id}
              className="st-pad"
              style={{
                '--pad-color': pad.color,
                opacity: activePad === pad.id ? 1 : 0.55,
                boxShadow: activePad === pad.id ? `0 0 26px ${pad.color}` : 'none',
              }}
              onClick={() => handlePadClick(pad.id)}
              disabled={phase !== 'input'}
              aria-label={`Star ${pad.id + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="st-status">
        {phase === 'idle' && (
          <button className="btn-primary" onClick={startGame}>START SEQUENCE</button>
        )}
        {phase === 'playing' && <p className="ec-progress">TRANSMITTING…</p>}
        {phase === 'input' && <p className="ec-progress">YOUR TURN — repeat the pattern</p>}
        {phase === 'lost' && (
          <div className="ec-results">
            <h2>SIGNAL LOST AT LEVEL {level}</h2>
            <p>BEST LEVEL: {best}</p>
            <button className="btn-primary" onClick={startGame}>RUN AGAIN</button>
          </div>
        )}
      </div>
    </GameShell>
  )
}