// Handles saving/reading scores. Always keeps a localStorage copy so
// every game works instantly and offline. If a user is signed in
// (Firebase Auth) and Firebase is configured, scores also sync to
// Firestore under users/{uid}/scores/{gameId} — that's what lets
// scores follow you across devices instead of being stuck to one
// browser.

import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase.js'

const LOCAL_KEY = 'arcade-scores'

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}
  } catch {
    return {}
  }
}

function writeLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

export async function saveScore(gameId, score, user, meta = {}) {
  const local = readLocal()
  const prevBest = local[gameId]?.best ?? 0
  const best = Math.max(prevBest, score)
  local[gameId] = { best, last: score, updatedAt: new Date().toISOString() }
  writeLocal(local)

  if (user && isFirebaseConfigured) {
    try {
      const ref = doc(db, 'users', user.uid, 'scores', gameId)
      const existing = await getDoc(ref)
      const existingBest = existing.exists() ? existing.data().best ?? 0 : 0
      await setDoc(ref, {
        best: Math.max(existingBest, score),
        last: score,
        meta,
        updatedAt: new Date().toISOString(),
      })
    } catch {
      // Offline, permissions not set up yet, or Firestore misconfigured —
      // localStorage above already has the score, so nothing is lost.
    }
  }

  return { best }
}

export function getBestScore(gameId) {
  return readLocal()[gameId]?.best ?? 0
}

export async function getLeaderboard(user) {
  if (user && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'scores'))
      const rows = []
      snap.forEach((docSnap) => rows.push({ gameId: docSnap.id, best: docSnap.data().best }))
      if (rows.length) return rows
    } catch {
      // fall through to local
    }
  }
  const local = readLocal()
  return Object.entries(local).map(([gameId, v]) => ({ gameId, best: v.best }))
}
