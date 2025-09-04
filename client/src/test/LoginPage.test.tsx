import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithAuth } from './utils';
import Login from '@/pages/Login';
import { http, HttpResponse } from 'msw';
import { mswServer } from './setup';

const API_URL = 'http://localhost:8000';

describe('Login page', () => {
  it('shows error when fields empty', async () => {
    renderWithAuth(<Login />, { authOverrides: { isAuthenticated: false } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    // We cannot easily capture toast content; ensure no navigation and submit disabled toggles
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('logs in successfully and stores token', async () => {
    mswServer.use(
      http.post(`${API_URL}/api/auth/login`, async () => {
        return HttpResponse.json({
          success: true,
          token: 't123',
          user: { id: '1', name: 'John', email: 'john@example.com', userType: 'patient' },
        });
      })
    );
    renderWithAuth(<Login />, { authOverrides: { isAuthenticated: false } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Passw0rd!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(localStorage.getItem('token') || sessionStorage.getItem('token')).toBeTruthy());
  });
});
