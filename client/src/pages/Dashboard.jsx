import { games } from '../games/registry.js'
import GameCard from '../components/GameCard.jsx'

export default function Dashboard() {
  return (
    <div className="container">
      <section style={{ padding: '1.5rem 0 2rem', textAlign: 'center' }}>
        <span className="script-accent" style={{ fontSize: '1.4rem', color: '#F472B6' }}>
          pick your game
        </span>
      </section>

      <section
        style={{
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          padding: '0 0 4rem',
        }}
      >
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </section>
    </div>
  )
}
