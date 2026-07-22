import { describe, it, expect, afterEach, vi } from 'vitest'
import { askGroqForJson, isGroqConfigured } from './groqClient.js'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('isGroqConfigured', () => {
  it('is false when no key is set', () => {
    vi.stubEnv('VITE_GROQ_API_KEY', '')
    expect(isGroqConfigured()).toBe(false)
  })

  it('is true when a key is set', () => {
    vi.stubEnv('VITE_GROQ_API_KEY', 'test-key')
    expect(isGroqConfigured()).toBe(true)
  })
})

describe('askGroqForJson', () => {
  it('returns null immediately when no API key is configured (no network call made)', async () => {
    vi.stubEnv('VITE_GROQ_API_KEY', '')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await askGroqForJson('system', 'user')

    expect(result).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns null if the API call fails', async () => {
    vi.stubEnv('VITE_GROQ_API_KEY', 'test-key')
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network down'))))

    const result = await askGroqForJson('system', 'user')
    expect(result).toBeNull()
  })

  it('returns null if the API responds with a non-OK status', async () => {
    vi.stubEnv('VITE_GROQ_API_KEY', 'test-key')
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })))

    const result = await askGroqForJson('system', 'user')
    expect(result).toBeNull()
  })

  it('returns null if the response content is not valid JSON', async () => {
    vi.stubEnv('VITE_GROQ_API_KEY', 'test-key')
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'not json' } }] }),
    })))

    const result = await askGroqForJson('system', 'user')
    expect(result).toBeNull()
  })

  it('parses and returns valid JSON content from a successful call', async () => {
    vi.stubEnv('VITE_GROQ_API_KEY', 'test-key')
    const payload = { emojis: '🎬🍿', answer: 'Movie Night' }
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: JSON.stringify(payload) } }] }),
    })))

    const result = await askGroqForJson('system', 'user')
    expect(result).toEqual(payload)
  })
})
