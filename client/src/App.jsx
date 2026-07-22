import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Cipher from './games/Cipher/Cipher.jsx'
import SignalTrace from './games/SignalTrace/SignalTrace.jsx'
import WordLadder from './games/WordLadder/WordLadder.jsx'
import EmojiCharades from './games/EmojiCharades/EmojiCharades.jsx'
import ReverseTrivia from './games/ReverseTrivia/ReverseTrivia.jsx'
import MoodMatch from './games/MoodMatch/MoodMatch.jsx'
import ColorDeception from './games/ColorDeception/ColorDeception.jsx'
import MemoryMatch from './games/MemoryMatch/MemoryMatch.jsx'
import FactOrFiction from './games/FactOrFiction/FactOrFiction.jsx'
import RiddleEngine from './games/RiddleEngine/RiddleEngine.jsx'
import StoryBranch from './games/StoryBranch/StoryBranch.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/play/cipher" element={<Cipher />} />
        <Route path="/play/signal-trace" element={<SignalTrace />} />
        <Route path="/play/word-ladder" element={<WordLadder />} />
        <Route path="/play/emoji-charades" element={<EmojiCharades />} />
        <Route path="/play/reverse-trivia" element={<ReverseTrivia />} />
        <Route path="/play/mood-match" element={<MoodMatch />} />
        <Route path="/play/color-deception" element={<ColorDeception />} />
        <Route path="/play/memory-match" element={<MemoryMatch />} />
        <Route path="/play/fact-or-fiction" element={<FactOrFiction />} />
        <Route path="/play/riddle-engine" element={<RiddleEngine />} />
        <Route path="/play/story-branch" element={<StoryBranch />} />
      </Routes>
    </>
  )
}