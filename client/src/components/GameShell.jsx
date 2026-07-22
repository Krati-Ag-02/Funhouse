import { Link } from 'react-router-dom'
import { games } from '../games/registry.js'
import './GameShell.css'

export default function GameShell({ gameId, best, children }) {
  const meta = games.find((g) => g.id === gameId) || {}

  return (
    <div className="container game-shell">
      <div className="game-shell-header">
        <Link to="/" className="back-link">&larr; All games</Link>
        {typeof best === 'number' && <div className="best-badge">Best {best}</div>}
      </div>

      <div className="game-hero" style={{ '--hero-gradient': meta.gradient }}>
        <div className="game-hero-icon">{meta.icon}</div>
        <h1 className="game-hero-title">{meta.title}</h1>
        {meta.aiPowered && <span className="game-hero-ai">✨ AI-generated</span>}
      </div>

      <div className="game-panel">{children}</div>
    </div>
  )
}
