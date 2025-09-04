import React from 'react';
import { MemoryRouter, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthContext } from '@/context/AuthContextObject';

type User = {
  id: string;
  name: string;
  email: string;
  userType: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
  );
}

export function renderWithAuth(
  ui: React.ReactElement,
  {
    authOverrides,
    route = '/',
    routes,
  }: {
    authOverrides?: Partial<AuthContextType>;
    route?: string;
    routes?: React.ReactElement;
  } = {}
) {
  const defaultAuth: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: () => {},
    logout: () => {},
    refreshUser: async () => {},
  };

  const value: AuthContextType = { ...defaultAuth, ...authOverrides } as AuthContextType;

  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={value}>
        {routes ? (
          <Routes>{routes}</Routes>
        ) : (
          ui
        )}
      </AuthContext.Provider>
    </MemoryRouter>
  );
}
