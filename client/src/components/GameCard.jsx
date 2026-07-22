import { Link } from 'react-router-dom'
import './GameCard.css'

export default function GameCard({ game }) {
  return (
    <Link
      to={game.path}
      className="fun-card"
      style={{ '--card-gradient': game.gradient }}
    >
      <div className="fun-card-icon">{game.icon}</div>
      <h3 className="fun-card-title">{game.title}</h3>
      <p className="fun-card-desc">{game.tagline}</p>
      {game.aiPowered && <span className="fun-card-ai">✨ AI-generated</span>}
    </Link>
  )
}
