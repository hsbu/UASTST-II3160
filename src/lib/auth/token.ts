import { jwtDecode } from 'jwt-decode';
import { User, UserRole } from '@/types';

interface TokenPayload {
  userId: string;
  role: UserRole;
  exp: number;
  iat: number;
}

const TOKEN_KEY = 'library_auth_token';

// In-memory token for SSR safety
let memoryToken: string | null = null;

export const tokenManager = {
  /**
   * Store the JWT token
   */
  setToken(token: string): void {
    memoryToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Get the stored JWT token
   */
  getToken(): string | null {
    if (memoryToken) return memoryToken;
    if (typeof window !== 'undefined') {
      memoryToken = localStorage.getItem(TOKEN_KEY);
    }
    return memoryToken;
  },

  /**
   * Remove the stored JWT token
   */
  removeToken(): void {
    memoryToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Check if the token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      // exp is in seconds, Date.now() is in milliseconds
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  /**
   * Get the decoded payload from the token
   */
  getPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  },

  /**
   * Get user info from the token
   */
  getUser(): User | null {
    const payload = this.getPayload();
    if (!payload) return null;

    return {
      userId: payload.userId,
      role: payload.role,
    };
  },

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    const payload = this.getPayload();
    return payload?.role === role;
  },

  /**
   * Check if current user is a librarian
   */
  isLibrarian(): boolean {
    return this.hasRole('librarian');
  },

  /**
   * Check if current user is a member
   */
  isMember(): boolean {
    return this.hasRole('member');
  },

  /**
   * Check if a valid token exists and is not expired
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  },
};
