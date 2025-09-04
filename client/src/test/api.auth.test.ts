import { describe, it, expect, beforeEach } from 'vitest';
import { mswServer } from './setup';
import { http, HttpResponse } from 'msw';
import { login, register, getCurrentUser, logout, isAuthenticated } from '@/services/api';

const API_URL = 'http://localhost:8000';

describe('api auth service', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('register returns success', async () => {
    mswServer.use(
      http.post(`${API_URL}/api/auth/register`, async () => {
        return HttpResponse.json({ success: true, message: 'Registered' });
      })
    );

    const res = await register('John', 'john@example.com', 'Passw0rd!', 'patient');
    expect(res.success).toBe(true);
  });

  it('login stores token in localStorage when rememberMe true', async () => {
    mswServer.use(
      http.post(`${API_URL}/api/auth/login`, async () => {
        return HttpResponse.json({
          success: true,
          token: 'abc123',
          user: { id: '1', name: 'John', email: 'john@example.com', userType: 'patient' },
        });
      })
    );

    const res = await login('john@example.com', 'Passw0rd!', true);
    expect(res.success).toBe(true);
    expect(localStorage.getItem('token')).toBe('abc123');
    expect(sessionStorage.getItem('token')).toBe(null);
  });

  it('login stores token in sessionStorage when rememberMe false', async () => {
    mswServer.use(
      http.post(`${API_URL}/api/auth/login`, async () => {
        return HttpResponse.json({
          success: true,
          token: 'abc123',
          user: { id: '1', name: 'John', email: 'john@example.com', userType: 'patient' },
        });
      })
    );

    const res = await login('john@example.com', 'Passw0rd!', false);
    expect(res.success).toBe(true);
    expect(sessionStorage.getItem('token')).toBe('abc123');
    expect(localStorage.getItem('token')).toBe(null);
  });

  it('getCurrentUser returns error without token', async () => {
    const res = await getCurrentUser();
    expect(res.success).toBe(false);
    expect(res.message).toMatch(/No authentication token/);
  });

  it('isAuthenticated reflects storage state and logout clears', async () => {
    expect(isAuthenticated()).toBe(false);
    localStorage.setItem('token', 't');
    expect(isAuthenticated()).toBe(true);
    logout();
    expect(isAuthenticated()).toBe(false);
  });
});
