import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { renderWithAuth } from './utils';
import { Routes, Route } from 'react-router-dom';

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithAuth(
      <Routes>
        <Route path="/" element={<ProtectedRoute><div>Secret</div></ProtectedRoute>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { authOverrides: { isAuthenticated: false, isLoading: false }, route: '/' }
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    renderWithAuth(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>,
      { authOverrides: { isAuthenticated: false, isLoading: true } }
    );
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('renders children when authenticated', () => {
    renderWithAuth(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>,
      { authOverrides: { isAuthenticated: true, isLoading: false } }
    );
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });
});
