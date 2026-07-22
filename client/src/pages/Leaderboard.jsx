import { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/scoreService.js'
import { useAuth } from '../services/AuthContext.jsx'
import { games } from '../games/registry.js'

export default function Leaderboard() {
  const { user, firebaseReady } = useAuth()
  const [rows, setRows] = useState([])

  useEffect(() => {
    getLeaderboard(user).then(setRows)
  }, [user])

  function metaFor(gameId) {
    return games.find((g) => g.id === gameId)
  }

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem' }}>
      <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: '1.75rem', textAlign: 'center' }}>Scores</h1>

      <div className="game-panel">
        {rows.length === 0 && (
          <p style={{ color: 'var(--text-dim)' }}>No scores yet — play a game to see your best result here.</p>
        )}
        {rows.map((row) => {
          const meta = metaFor(row.gameId)
          return (
            <div
              key={row.gameId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 0',
                borderBottom: '1px solid var(--line)',
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{meta?.icon}</span>
              <span style={{ flexGrow: 1 }}>{meta?.title ?? row.gameId}</span>
              <span style={{
                background: meta?.gradient,
                color: '#fff',
                padding: '0.2rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
              }}>{row.best}</span>
            </div>
          )
        })}
      </div>

      {firebaseReady && !user && (
        <p style={{ color: 'var(--text-faint)', marginTop: '1rem', fontSize: '0.9rem' }}>
          Signed out — showing scores saved on this device. Sign in to sync scores across devices.
        </p>
      )}
      {!firebaseReady && (
        <p style={{ color: 'var(--text-faint)', marginTop: '1rem', fontSize: '0.9rem' }}>
          Scores are saved on this device. Add your Firebase config (see README) to enable
          sign-in and cross-device score syncing.
        </p>
      )}
    </div>
  )
}
