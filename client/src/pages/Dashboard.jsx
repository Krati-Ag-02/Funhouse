import { games } from '../games/registry.js'
import GameCard from '../components/GameCard.jsx'
import './Dashboard.css'

// Deterministic tilt/offset per position so the board reads as
// "pinned up by hand", not randomly jittering on every render.
const TILTS = [-4, 3, -6, 5, -2, 4, -5, 2, -3, 6, -4, 3]
const LIFTS = [0, 26, 10, 34, 4, 20, 0, 30, 14, 24, 6, 18]
const PIN_COLORS = ['var(--gold)', 'var(--rose)', 'var(--teal)', 'var(--purple)']

export default function Dashboard() {
  return (
    <div className="container">
      <section className="dash-hero">
        <span className="dash-eyebrow label-mono">the funhouse is open</span>
        <h1 className="dash-title script-accent">you're invited — pick your game</h1>
        <div className="dash-divider" aria-hidden="true">
          <span />
          <span className="dash-star">✦</span>
          <span />
        </div>
      </section>

      <section className="dash-board">
        <div className="dash-board-row">
          {games.map((game, i) => (
            <div
              key={game.id}
              className="board-pin"
              style={{
                '--tilt': `${TILTS[i % TILTS.length]}deg`,
                '--lift': `${LIFTS[i % LIFTS.length]}px`,
                '--pin-color': PIN_COLORS[i % PIN_COLORS.length],
              }}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}