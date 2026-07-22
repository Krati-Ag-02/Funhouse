import './Confetti.css'

const COLORS = ['var(--gold)', 'var(--rose)', 'var(--teal)', 'var(--purple)', 'var(--blue)']

// Drop <Confetti /> at the top of any "results" / "game over" block.
// It fires once on mount — remount it (e.g. with a key) to fire again.
export default function Confetti({ count = 36 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.6 + Math.random() * 1.1,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
  }))

  return (
    <div className="confetti-field" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--rot': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}