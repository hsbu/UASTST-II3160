// User types for authentication

import { UserRole } from './loan';

export interface User {
  userId: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
