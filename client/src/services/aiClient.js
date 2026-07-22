// Abstraction layer between game components and "where content comes
// from." Every function here tries Groq first (via groqClient.js);
// if there's no key configured, the call times out, or Groq returns
// something malformed, it transparently falls back to a local,
// hand-written question bank. No game component needs to know which
// source it got — a missing key or a Groq outage never breaks a game.

import { askGroqForJson, isGroqConfigured } from './groqClient.js'
import { getRoundsByDifficulty } from '../games/EmojiCharades/data.js'
import { getRandomCategoryQuestions } from '../games/ReverseTrivia/data.js'
import { getMoodScenarios } from '../games/MoodMatch/data.js'
import { getFactBank } from '../games/FactOrFiction/data.js'
import { getRiddleBank } from '../games/RiddleEngine/data.js'
import { getStoryBank } from '../games/StoryBranch/data.js'

const SAFETY_CLAUSE =
  'Keep all content clean, family-friendly, and appropriate for all ages, from children to grandparents. Avoid anything violent, political, or adult-themed.'

function pickRandom(arr, excludeKey, excludeValues = []) {
  const pool = excludeKey ? arr.filter((item) => !excludeValues.includes(item[excludeKey])) : arr
  const source = pool.length ? pool : arr
  return source[Math.floor(Math.random() * source.length)]
}

export { isGroqConfigured }

export async function getEmojiRound(difficulty, excludeAnswers = []) {
  if (isGroqConfigured()) {
    const system = `You generate rounds for an emoji-charades style game. ${SAFETY_CLAUSE} Respond with ONLY a JSON object: {"emojis": "2-4 emoji string", "answer": "the phrase in Title Case", "options": ["four short phrase strings including the answer, shuffled"]}`
    const user = `Difficulty: ${difficulty}. Give one well-known movie title, idiom, or common phrase that can be represented with emojis. Avoid these already-used answers: ${excludeAnswers.join(', ') || 'none'}.`
    const result = await askGroqForJson(system, user)
    if (result?.emojis && result?.answer && Array.isArray(result?.options)) {
      return { ...result, source: 'groq' }
    }
  }
  const rounds = getRoundsByDifficulty(difficulty)
  return { ...pickRandom(rounds, 'answer', excludeAnswers), source: 'local' }
}

export async function getTriviaRound(excludeAnswers = []) {
  if (isGroqConfigured()) {
    const system = `You generate Jeopardy-style reverse-trivia rounds. ${SAFETY_CLAUSE} Respond with ONLY a JSON object: {"category": "short category name", "answerShown": "a factual statement", "correctQuestion": "What is X? (matching question form)", "options": ["four question-form strings including the correct one, shuffled"]}`
    const user = `Pick any general-knowledge topic (geography, science, history, food, animals, everyday life). Avoid these already-used questions: ${excludeAnswers.join(', ') || 'none'}.`
    const result = await askGroqForJson(system, user)
    if (result?.answerShown && result?.correctQuestion && Array.isArray(result?.options)) {
      return { ...result, source: 'groq' }
    }
  }
  const rounds = getRandomCategoryQuestions(excludeAnswers)
  return { ...pickRandom(rounds, null, []), source: 'local' }
}

export async function getMoodRound(excludeIds = [], excludeTexts = []) {
  if (isGroqConfigured()) {
    const system = `You generate short everyday scenarios for a "pick the best emoji reaction" game. ${SAFETY_CLAUSE} Respond with ONLY a JSON object: {"text": "a one-sentence relatable scenario", "best": "the single best-fit emoji", "options": ["four distinct emoji including best, shuffled"]}`
    const user = `Describe one relatable everyday moment (comfort, surprise, mild frustration, joy, embarrassment, etc). Avoid repeating these scenarios: ${excludeTexts.join(' | ') || 'none'}.`
    const result = await askGroqForJson(system, user)
    if (result?.text && result?.best && Array.isArray(result?.options)) {
      return { ...result, id: result.text, source: 'groq' }
    }
  }
  const scenarios = getMoodScenarios().filter((s) => !excludeIds.includes(s.id))
  const source = scenarios.length ? scenarios : getMoodScenarios()
  return { ...source[Math.floor(Math.random() * source.length)], source: 'local' }
}

export async function getFactRound(excludeStatements = []) {
  if (isGroqConfigured()) {
    const system = `You generate rounds for a "true or false" trivia game. ${SAFETY_CLAUSE} Respond with ONLY a JSON object: {"statement": "an interesting factual-sounding claim", "isTrue": true or false, "explanation": "one short sentence explaining the real answer"}`
    const user = `Give one surprising claim about science, animals, history, or geography — half the time make it true, half the time make it false but plausible-sounding. Avoid repeating: ${excludeStatements.join(' | ') || 'none'}.`
    const result = await askGroqForJson(system, user)
    if (typeof result?.statement === 'string' && typeof result?.isTrue === 'boolean') {
      return { ...result, source: 'groq' }
    }
  }
  const bank = getFactBank().filter((f) => !excludeStatements.includes(f.statement))
  const source = bank.length ? bank : getFactBank()
  return { ...source[Math.floor(Math.random() * source.length)], source: 'local' }
}

export async function getRiddleRound(excludeAnswers = []) {
  if (isGroqConfigured()) {
    const system = `You generate classic-style riddles. ${SAFETY_CLAUSE} Respond with ONLY a JSON object: {"riddle": "the riddle text", "answer": "the one-to-three word answer", "options": ["four short answer strings including the correct one, shuffled"]}`
    const user = `Give one classic-style riddle suitable for all ages, easy enough to solve in under a minute. Avoid these answers: ${excludeAnswers.join(', ') || 'none'}.`
    const result = await askGroqForJson(system, user)
    if (result?.riddle && result?.answer && Array.isArray(result?.options)) {
      return { ...result, source: 'groq' }
    }
  }
  const bank = getRiddleBank().filter((r) => !excludeAnswers.includes(r.answer))
  const source = bank.length ? bank : getRiddleBank()
  return { ...source[Math.floor(Math.random() * source.length)], source: 'local' }
}

export async function getStoryRound(excludeScenarios = []) {
  if (isGroqConfigured()) {
    const system = `You generate tiny "choose your path" story moments. ${SAFETY_CLAUSE} Respond with ONLY a JSON object: {"scenario": "a 1-2 sentence setup", "choices": [{"id": "a", "text": "short choice text", "outcome": "1 sentence result", "quality": "best"}, {"id": "b", "text": "...", "outcome": "...", "quality": "good"}, {"id": "c", "text": "...", "outcome": "...", "quality": "poor"}]}. Exactly one choice must have quality "best", one "good", one "poor".`
    const user = `Give one lighthearted everyday scenario with a decision to make (not violent, not high-stakes). Avoid repeating: ${excludeScenarios.join(' | ') || 'none'}.`
    const result = await askGroqForJson(system, user)
    if (result?.scenario && Array.isArray(result?.choices) && result.choices.length >= 3) {
      return { ...result, source: 'groq' }
    }
  }
  const bank = getStoryBank().filter((s) => !excludeScenarios.includes(s.scenario))
  const source = bank.length ? bank : getStoryBank()
  return { ...source[Math.floor(Math.random() * source.length)], source: 'local' }
}
