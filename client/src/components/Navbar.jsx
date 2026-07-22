import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../services/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'
import './Navbar.css'

export default function Navbar() {
  const { user, firebaseReady, signOut } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand-marquee">
            <span className="bulb-row" aria-hidden="true">
              <span className="bulb" />
              <span className="bulb" />
              <span className="bulb" />
            </span>
            <span className="brand">Funhouse</span>
            <span className="navbar-tagline script-accent">step right up</span>
          </Link>

          <nav aria-label="Main" className="navbar-links">
            <Link to="/">Games</Link>
            <Link to="/leaderboard">Scores</Link>
            {firebaseReady && (
              user ? (
                <button className="auth-btn" onClick={signOut}>
                  {user.email?.split('@')[0] || 'Sign out'}
                </button>
              ) : (
                <button className="auth-btn" onClick={() => setAuthOpen(true)}>Sign in</button>
              )
            )}
          </nav>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}