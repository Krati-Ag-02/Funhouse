import { useEffect, useState } from 'react'
import { useAuth } from '../services/AuthContext.jsx'
import './AuthModal.css'

const FRIENDLY_ERRORS = {
  'auth/invalid-email': 'That email address doesn\u2019t look right.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Wrong password — try again.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/email-already-in-use': 'An account already exists with that email.',
  'auth/weak-password': 'Password should be at least 6 characters.',
}

export default function AuthModal({ open, onClose }) {
  const { user, signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Close automatically once sign-in succeeds.
  useEffect(() => {
    if (user && open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (!open) {
      setEmail('')
      setPassword('')
      setError(null)
      setMode('signin')
    }
  }, [open])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(FRIENDLY_ERRORS[err.code] || 'Something went wrong — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="auth-booth" role="dialog" aria-modal="true" aria-label="Sign in">
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <div className="auth-bulbs" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        <h2 className="auth-title">{mode === 'signup' ? 'Get your ticket' : 'Welcome back'}</h2>
        <p className="auth-subtitle script-accent">
          {mode === 'signup' ? 'create an account to save your scores' : 'sign in to sync your scores'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'One moment…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === 'signup' ? (
            <>Already have a ticket? <button onClick={() => setMode('signin')}>Sign in</button></>
          ) : (
            <>New here? <button onClick={() => setMode('signup')}>Create an account</button></>
          )}
        </p>
      </div>
    </div>
  )
}