import { jwtDecode } from 'jwt-decode';
import { User, UserRole } from '@/types';

interface TokenPayload {
  userId: string;
  role: UserRole;
  exp: number;
  iat: number;
}

const CATALOGING_TOKEN_KEY = 'library_cataloging_token';
const CIRCULATION_TOKEN_KEY = 'library_circulation_token';

// In-memory tokens for SSR safety
let memoryCatalogingToken: string | null = null;
let memoryCirculationToken: string | null = null;

export const tokenManager = {
  /**
   * Store the cataloging JWT token
   */
  setCatalogingToken(token: string): void {
    memoryCatalogingToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CATALOGING_TOKEN_KEY, token);
    }
  },

  /**
   * Store the circulation JWT token
   */
  setCirculationToken(token: string): void {
    memoryCirculationToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CIRCULATION_TOKEN_KEY, token);
    }
  },

  /**
   * Get the cataloging token
   */
  getCatalogingToken(): string | null {
    if (memoryCatalogingToken) return memoryCatalogingToken;
    if (typeof window !== 'undefined') {
      memoryCatalogingToken = localStorage.getItem(CATALOGING_TOKEN_KEY);
    }
    return memoryCatalogingToken;
  },

  /**
   * Get the circulation token
   */
  getCirculationToken(): string | null {
    if (memoryCirculationToken) return memoryCirculationToken;
    if (typeof window !== 'undefined') {
      memoryCirculationToken = localStorage.getItem(CIRCULATION_TOKEN_KEY);
    }
    return memoryCirculationToken;
  },

  /**
   * Remove all tokens
   */
  removeTokens(): void {
    memoryCatalogingToken = null;
    memoryCirculationToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CATALOGING_TOKEN_KEY);
      localStorage.removeItem(CIRCULATION_TOKEN_KEY);
    }
  },

  /**
   * Check if a specific token is expired
   */
  isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  /**
   * Check if cataloging token is expired
   */
  isCatalogingTokenExpired(): boolean {
    return this.isTokenExpired(this.getCatalogingToken());
  },

  /**
   * Check if circulation token is expired
   */
  isCirculationTokenExpired(): boolean {
    return this.isTokenExpired(this.getCirculationToken());
  },

  /**
   * Get the decoded payload from circulation token (primary for user info)
   */
  getPayload(): TokenPayload | null {
    const token = this.getCirculationToken();
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
   * Check if both tokens exist and are not expired
   */
  isAuthenticated(): boolean {
    const catalogingToken = this.getCatalogingToken();
    const circulationToken = this.getCirculationToken();
    
    return (
      !!catalogingToken &&
      !!circulationToken &&
      !this.isTokenExpired(catalogingToken) &&
      !this.isTokenExpired(circulationToken)
    );
  },
};
