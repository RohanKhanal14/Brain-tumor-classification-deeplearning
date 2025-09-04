// Global test setup for Vitest + RTL
import type {} from 'vitest';
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Polyfill: TextEncoder/TextDecoder for some libs
import { TextEncoder, TextDecoder } from 'util';
const g = globalThis as unknown as {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
};
if (!g.TextEncoder) g.TextEncoder = TextEncoder;
if (!g.TextDecoder) g.TextDecoder = TextDecoder;

// Silence console noise during tests; keep errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
console.error = (...args) => {
  const msg = args[0]?.toString?.() || '';
  if (msg.includes('Warning: ReactDOM.render is no longer supported') ||
      msg.includes('React state update on an unmounted component')) {
    return;
  }
  originalConsoleError(...args);
};
console.warn = (...args) => {
  originalConsoleWarn(...args);
};

// MSW setup (optional; enabled when handlers are defined)
import { setupServer } from 'msw/node';
export const mswServer = setupServer();

beforeAll(() => mswServer.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

// Utility to mock local/session storage per test
class StorageMock implements Storage {
  private store: Record<string, string> = {};
  get length() { return Object.keys(this.store).length; }
  clear() { this.store = {}; }
  getItem(key: string) { return this.store[key] ?? null; }
  key(index: number) { return Object.keys(this.store)[index] ?? null; }
  removeItem(key: string) { delete this.store[key]; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
}

Object.defineProperty(globalThis, 'localStorage', { value: new StorageMock() });
Object.defineProperty(globalThis, 'sessionStorage', { value: new StorageMock() });

// Mock window.location for redirects in AuthContext
const { location } = window;
Object.defineProperty(window, 'location', {
  value: { ...location, assign: vi.fn(), replace: vi.fn(), href: '/' },
  writable: true,
});

// Polyfill ResizeObserver required by Radix UI components in JSDOM
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// Assign mock globally for jsdom
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserverMock;
  }
}
// Assign on window and globalThis
(window as unknown as { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver = ResizeObserverMock;
(globalThis as unknown as { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver = ResizeObserverMock;

// Polyfill matchMedia for theme handling and sonner
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Polyfill URL.createObjectURL for jsdom (used when previewing uploaded images)
if (!('URL' in globalThis)) {
  (globalThis as any).URL = {};
}
if (!(globalThis as any).URL.createObjectURL) {
  (globalThis as any).URL.createObjectURL = () => 'blob:mock-url';
}
if (!(globalThis as any).URL.revokeObjectURL) {
  (globalThis as any).URL.revokeObjectURL = () => {};
}
