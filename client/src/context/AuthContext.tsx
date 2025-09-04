import React, { useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout } from '@/services/api';
import type { AuthContextType, User } from './types';
import { AuthContext } from './AuthContextObject';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Get stored user data first for immediate display
          const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          
          // Then verify with the server
          const result = await getCurrentUser();
          if (result.success && result.user) {
            setUser(result.user);
          } else {
            // If server validation fails, log out
            handleLogout();
          }
        } catch (error) {
          console.error('Error verifying authentication:', error);
          handleLogout();
        }
      }
      setIsAuthLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/login';
  };

  const handleRefreshUser = async () => {
    try {
      // Fetch updated user data from the server
      const result = await getCurrentUser();
      if (result.success && result.user) {
        setUser(result.user);
        
        // Also update localStorage/sessionStorage
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(result.user));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isAuthLoading,
        login: handleLogin,
        logout: handleLogout,
        refreshUser: handleRefreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook moved to './useAuth' to satisfy fast-refresh constraints.
