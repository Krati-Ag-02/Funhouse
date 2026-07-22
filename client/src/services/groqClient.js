// Calls Groq's chat completions API directly from the browser.
//
// NOTE ON SECURITY: this means VITE_GROQ_API_KEY ends up in the
// public JS bundle — anyone can view it in dev tools. That trade-off
// was made deliberately to avoid running a separate backend just to
// hide one key. If this key gets abused, rotate it in the Groq
// console; consider a Cloud Function proxy instead if usage grows.
//
// Every function here returns null on any failure (no key configured,
// network error, bad JSON) — callers always have a static fallback
// question bank, so a missing key or a Groq outage never breaks a game.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.1-8b-instant'
const TIMEOUT_MS = 8000

export function isGroqConfigured() {
  return Boolean(import.meta.env.VITE_GROQ_API_KEY)
}

export async function askGroqForJson(systemPrompt, userPrompt, { model = DEFAULT_MODEL } = {}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.9,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    })

    if (!res.ok) return null

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) return null

    return JSON.parse(text)
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}
