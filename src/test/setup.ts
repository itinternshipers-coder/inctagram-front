import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, afterAll, beforeAll } from 'vitest'
import { server } from './msw-server'

// Node.js fetch (undici) не поддерживает относительные URL.
// Патчим Request и fetch чтобы RTK Query's fetchBaseQuery работал с baseUrl: '/api/v1'
const TEST_ORIGIN = 'http://localhost:3000'
const OriginalRequest = globalThis.Request
globalThis.Request = class PatchedRequest extends OriginalRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string' && input.startsWith('/')) {
      super(`${TEST_ORIGIN}${input}`, init)
    } else {
      super(input, init)
    }
  }
} as typeof Request

const originalFetch = globalThis.fetch
globalThis.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/')) {
    return originalFetch(`${TEST_ORIGIN}${input}`, init)
  }
  return originalFetch(input, init)
}

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
