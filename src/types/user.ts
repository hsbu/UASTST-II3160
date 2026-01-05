// User types for authentication

export type UserRole = 'member' | 'librarian';

export interface User {
  userId: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
