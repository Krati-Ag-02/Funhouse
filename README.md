# Funhouse

Eleven small, single-player browser games. No accounts required to
play, no multiplayer coordination, no business problem to justify it —
built as a portfolio project that demonstrates real range: game logic,
a genuine AI integration, and the engineering habits (tests, CI, a
live deploy) a production codebase actually has.

**Stack:** React (Vite) + Firebase (Auth + Firestore) + Groq. No
separate backend — everything talks to Firebase directly, and Groq is
called straight from the browser (see the security note below on why,
and the trade-off that comes with it).

## Games

| Game | AI-powered? | What it is |
|---|---|---|
| Code Breaker | — | Decode a Caesar-shift-rotated phrase, 3 difficulty tiers |
| Echo Chain | — | Simon-says style sequence memory, with real Web Audio tones |
| Word Weaver | — | Climb from a start word to an end word, one letter at a time |
| Emoji Detective | ✅ Groq | Decode a phrase from an emoji clue |
| Quiz Flip | ✅ Groq | Jeopardy-style — you get the answer, you pick the question |
| Vibe Check | ✅ Groq | Pick the reaction that fits a scenario |
| Color Trap | — | Classic Stroop-effect reflex test, untimed |
| Match Mania | — | Flip-card pairs, with a calmer 6-pair mode |
| True or Not | ✅ Groq | One claim — real fact, or convincing fiction? |
| Riddle Me This | ✅ Groq | Classic-style riddles, freshly generated each round |
| Pick a Path | ✅ Groq | Choose a decision in a tiny scenario, see how it plays out |

Six games call Groq for infinite content variety; five are
mechanically fixed and don't need it. Every AI-backed game has a
hand-written local fallback bank, so a missing key or a Groq outage
never breaks a game — it just serves pre-written content instead (the
UI honestly shows "live round" vs "archive round," never pretending).

## Why there's no backend

Scores live in Firestore, keyed by the signed-in user's uid — no
server needed, since Firestore's own security rules (`firestore.rules`)
enforce that a user can only read/write their own scores.

Groq is the one exception worth understanding: normally an LLM API key
needs a server in front of it so the key never reaches the browser.
This project intentionally skips that, calling Groq directly from the
client to avoid running and paying for a separate backend. The
trade-off: **the Groq key is visible in the browser bundle** — anyone
could copy it from dev tools and use your quota. Acceptable for a demo
project with low traffic; if this ever needs to be hardened, the fix
is a small Firebase Cloud Function that proxies the Groq call (same
project, same deploy, key never leaves the server) — `src/services/groqClient.js`
is written as a single isolated module specifically so that swap is
contained to one file.

## Project structure

```
arcade-hub/
├── .github/workflows/ci.yml   # test + build on every push
├── firebase.json                # Hosting + Firestore config
├── firestore.rules              # security rules — the real access boundary
└── client/
    ├── .env.example
    ├── vitest.config.js
    └── src/
        ├── games/               # one folder per game: component + data + *.test.js
        ├── components/          # GameCard, GameShell, Navbar
        ├── pages/                 # Dashboard, Leaderboard
        ├── styles/quiz-shared.css  # shared toolbar/options/feedback classes
        └── services/
            ├── firebase.js        # Firebase app init (auth + Firestore)
            ├── AuthContext.jsx     # sign-in state, Google auth
            ├── groqClient.js       # direct-from-browser Groq call + safe fallback
            ├── aiClient.js         # builds prompts, calls Groq, falls back to local data
            └── scoreService.js     # Firestore when signed in, localStorage otherwise
```

## Running it locally

```bash
cd client
npm install
cp .env.example .env    # fill in Firebase config + Groq key (see below)
npm run dev
```
Opens at `http://localhost:5173`. Every game works immediately even
with an empty `.env` — AI-backed games use their local fallback bank,
and scores save to `localStorage`. Filling in the env vars unlocks
sign-in, cross-device scores, and live Groq-generated content.

## Setting up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → enable **Google**.
3. **Firestore Database** → create a database (production mode is fine
   — `firestore.rules` locks it down properly).
4. Project settings → General → "Your apps" → add a Web app → copy
   the config values into `client/.env`.
5. Install the Firebase CLI (`npm install -g firebase-tools`), run
   `firebase login`, then `firebase use --add` to link this repo to
   your project (updates `.firebaserc`).

## Setting up Groq

1. Get a free key at [console.groq.com](https://console.groq.com).
2. Add it to `client/.env` as `VITE_GROQ_API_KEY=...`.
3. Restart the dev server. AI-backed games switch from "archive round"
   to "live round" automatically — no other code changes needed.

## Testing

```bash
cd client && npm test
```
21 tests: game logic (Cipher's rotation puzzle, Word Ladder's
one-letter-per-step puzzles), score persistence, and the Groq client's
timeout/fallback behavior. The Word Ladder tests actually caught a
real bug during development — a hand-written puzzle where one step
silently changed two letters instead of one.

## Deployment

Everything ships through Firebase:
```bash
cd client && npm run build
cd ..
firebase deploy
```
This deploys both Hosting (the built React app) and the Firestore
rules in one command. Remember to add your production env vars
(`client/.env`) before building, since Vite bakes them into the build
at build time.

## Accessibility notes

- Every answer is multiple-choice or tap-based — no typing/spelling
  dependency in any game.
- No hard timers anywhere; Color Trap and Echo Chain are the closest
  to "reflex," but neither penalizes taking your time.
- High-contrast text, visible keyboard focus states, generous tap
  targets, `prefers-reduced-motion` respected throughout.

## Known trade-offs worth being able to explain

- **Groq key is client-visible** (see "Why there's no backend" above)
  — a deliberate simplicity trade-off, with a documented upgrade path.
- **Bundle size**: the Firebase SDK adds meaningful weight to the
  build. Worth mentioning as a next step: code-splitting Firebase
  behind a dynamic `import()` so it only loads once someone actually
  signs in, rather than in the initial bundle.
