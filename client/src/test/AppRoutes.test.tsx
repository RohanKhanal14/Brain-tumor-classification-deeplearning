import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Force App to start at /analysis using MemoryRouter
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children?: React.ReactNode }) => (
      <actual.MemoryRouter initialEntries={["/analysis"]}>
        {children}
      </actual.MemoryRouter>
    ),
  };
});
import App from '@/App';
import { useAuth } from '@/context/useAuth';

vi.mock('@/context/useAuth', () => ({ useAuth: vi.fn() }));

describe('App routes', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('redirects unauthenticated user to /login on protected route', async () => {
    // Return unauthenticated state from hook
  (useAuth as unknown as Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
  });
  render(<App />);
  // At /analysis but unauthenticated, should render Login page
  expect(await screen.findByRole('heading', { name: /welcome to mastishka/i })).toBeInTheDocument();
  });

  it('allows authenticated user into protected route', async () => {
  (useAuth as unknown as Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'u1', name: 'User', email: 'u@e.com', userType: 'patient' },
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
  });
  render(<App />);
  // At /analysis and authenticated, should render Analysis page heading
  expect(await screen.findByRole('heading', { name: /mri analysis demo/i })).toBeInTheDocument();
  });
});
