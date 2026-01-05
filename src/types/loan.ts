// Loan types - matches circulation.js API responses

export type UserRole = 'member' | 'librarian';

export interface LoginRequest {
  userId: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: string;
  payload: {
    userId: string;
    role: UserRole;
  };
}

export interface LoanPolicy {
  maxActiveLoans: number;
  defaultLoanDays: number;
  finePerDay: number;
}

export interface LoanCreateRequest {
  userId: string;
  bookId: number;
  days?: number;
}

export interface LoanResponse {
  loanId: string;
  userId: string;
  bookId: number;
  dueAt: string;
  policy: LoanPolicy;
}

export interface FineBreakdown {
  loanId: string;
  bookId: number;
  dueAt: string;
  returnedAt: string | null;
  lateDays: number;
  fine: number;
}

export interface FinesResponse {
  userId: string;
  finePerDay: number;
  totalFine: number;
  loansCount: number;
  breakdown: FineBreakdown[];
}

export interface ReturnRequest {
  loanId: string;
}

export interface ReturnResponse {
  message: string;
  loanId: string;
  returnedAt: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  db: string;
  user?: {
    userId: string;
    role: UserRole;
  };
}
