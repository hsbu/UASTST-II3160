'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';
import { tokenManager } from '@/lib/auth';
import { circulationService, getApiErrorMessage } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLibrarian: boolean;
  isMember: boolean;
  login: (userId: string, role: UserRole) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from stored token on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const storedUser = tokenManager.getUser();
          setUser(storedUser);
        } else {
          tokenManager.removeTokens();
          setUser(null);
        }
      } catch {
        tokenManager.removeTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (userId: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await circulationService.login(userId, role);
      
      const loggedInUser: User = {
        userId: response.payload.userId,
        role: response.payload.role,
      };
      
      setUser(loggedInUser);
      router.push('/books');
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    circulationService.logout();
    setUser(null);
    setError(null);
    router.push('/login');
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && tokenManager.isAuthenticated(),
    isLoading,
    isLibrarian: user?.role === 'librarian',
    isMember: user?.role === 'member',
    login,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
