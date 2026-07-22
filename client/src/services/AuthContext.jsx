import { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase.js'

const AuthContext = createContext({
  user: null,
  loading: false,
  firebaseReady: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Create a new account
  async function signUp(email, password) {
    if (!isFirebaseConfigured) return
    return await createUserWithEmailAndPassword(auth, email, password)
  }

  // Log in existing user
  async function signIn(email, password) {
    if (!isFirebaseConfigured) return
    return await signInWithEmailAndPassword(auth, email, password)
  }

  // Log out
  async function signOut() {
    if (!isFirebaseConfigured) return
    return await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, firebaseReady: isFirebaseConfigured, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}