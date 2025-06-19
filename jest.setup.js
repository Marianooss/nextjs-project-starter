// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock Request and Response
if (typeof Request !== 'function') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = input
      this.method = init.method || 'GET'
      this.body = init.body
      this.headers = new Headers(init.headers)
    }

    async json() {
      return this.body ? JSON.parse(this.body) : undefined
    }
  }
}

if (typeof Response !== 'function') {
  global.Response = class Response {
    constructor(body = '', init = {}) {
      this._body = body
      this.status = init.status || 200
      this.statusText = init.statusText || ''
      this.headers = new Headers(init.headers)
    }

    async json() {
      return this._body ? JSON.parse(this._body) : {}
    }
  }
}

// Mock Headers
if (typeof Headers !== 'function') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = new Map()
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value)
        })
      }
    }

    append(key, value) {
      this._headers.set(key.toLowerCase(), value)
    }

    get(key) {
      return this._headers.get(key.toLowerCase()) || null
    }
  }
}

// Suppress console errors during tests
global.console.error = jest.fn()
