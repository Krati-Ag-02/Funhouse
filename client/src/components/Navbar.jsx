import { Link } from 'react-router-dom'
import { useAuth } from '../services/AuthContext.jsx'
import './Navbar.css'

export default function Navbar() {
  const { user, firebaseReady, signIn, signOut } = useAuth()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Funhouse</Link>
        <nav aria-label="Main" className="navbar-links">
          <Link to="/">Games</Link>
          <Link to="/leaderboard">Scores</Link>
          {firebaseReady && (
            user ? (
              <button className="auth-btn" onClick={signOut}>
                {user.displayName?.split(' ')[0] || 'Sign out'}
              </button>
            ) : (
              <button className="auth-btn" onClick={signIn}>Sign in</button>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
