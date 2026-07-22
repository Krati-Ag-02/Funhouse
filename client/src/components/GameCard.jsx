import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './GameCard.css'

export default function GameCard({ game = {} }) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  )

  function handleMouseMove(e) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6
    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`
    )
  }

  function handleMouseLeave() {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  }

  return (
    <Link
      to={game.path || `/game/${game.id}`}
      ref={cardRef}
      className="deck-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        '--card-bg-gradient': game.gradient || 'linear-gradient(135deg, #211A3E 0%, #14102A 100%)',
        '--card-glow': game.glowColor || 'rgba(143, 121, 201, 0.3)',
      }}
    >
      <div className="deck-glow" aria-hidden="true" />

    

      <div className="marquee-strip" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="marquee-bulb" />
        ))}
      </div>
      <div className="perforation" />

      <div className="card-body">
        <div className="card-icon-wrapper">
          <span className="card-icon">{game.icon || '🎪'}</span>
        </div>
        <h3 className="card-title">{game.title || 'Untitled game'}</h3>
        <p className="card-desc">{game.tagline || game.description || 'No description available.'}</p>

        <div className="card-footer">
          <span className="ticket-label">admit one</span>
          <span className="play-arrow">PLAY →</span>
        </div>
      </div>
    </Link>
  )
}