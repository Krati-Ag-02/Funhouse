import { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/scoreService.js'
import { useAuth } from '../services/AuthContext.jsx'
import { games } from '../games/registry.js'
import './Leaderboard.css'

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
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div className="lb-hero">
        <h1 className="lb-title">Hall of Fame</h1>
        <p className="lb-subtitle script-accent">your best runs, framed and mounted</p>
      </div>

      <div className="lb-case">
        {rows.length === 0 && (
          <p className="lb-empty">No scores yet — play a game to see your best result here.</p>
        )}
        {rows.map((row) => {
          const meta = metaFor(row.gameId)
          return (
            <div key={row.gameId} className="lb-row">
              <span className="lb-medal" style={{ '--medal-gradient': meta?.gradient }}>
                {meta?.icon}
              </span>
              <span className="lb-name">{meta?.title ?? row.gameId}</span>
              <span className="lb-ribbon">{row.best}</span>
            </div>
          )
        })}
      </div>

      {firebaseReady && !user && (
        <p className="lb-note">
          Signed out — showing scores saved on this device. Sign in to sync scores across devices.
        </p>
      )}
      {!firebaseReady && (
        <p className="lb-note">
          Scores are saved on this device. Add your Firebase config (see README) to enable
          sign-in and cross-device score syncing.
        </p>
      )}
    </div>
  )
}