import { circulationApi } from './client';
import { tokenManager } from '@/lib/auth';
import {
  LoginRequest,
  LoginResponse,
  LoanCreateRequest,
  LoanResponse,
  FinesResponse,
  ReturnRequest,
  ReturnResponse,
  HealthCheckResponse,
  UserRole,
} from '@/types';

/**
 * Circulation Service - Loans, Fines, Returns API
 * Connects to circulation.js backend
 */
export const circulationService = {
  /**
   * POST /auth/login - Authenticate user and get JWT token
   * Access: public (no auth required)
   */
  async login(userId: string, role: UserRole): Promise<LoginResponse> {
    const requestBody: LoginRequest = { userId, role };
    
    // Login endpoint doesn't require auth, so we make a direct call
    const { data } = await circulationApi.post<LoginResponse>('/auth/login', requestBody);
    
    // Store the token
    tokenManager.setToken(data.token);
    
    return data;
  },

  /**
   * Logout - Clear the stored token
   */
  logout(): void {
    tokenManager.removeToken();
  },

  /**
   * GET /health - Health check endpoint
   * Access: authenticated users
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const { data } = await circulationApi.get<HealthCheckResponse>('/health');
    return data;
  },

  /**
   * POST /loan/create - Create a new loan
   * Access: member (own loans), librarian (any user)
   */
  async createLoan(request: LoanCreateRequest): Promise<LoanResponse> {
    const { data } = await circulationApi.post<LoanResponse>('/loan/create', request);
    return data;
  },

  /**
   * GET /loan/fines/:userId - Get fines for a user
   * Access: member (own fines), librarian (any user)
   */
  async getFines(userId: string): Promise<FinesResponse> {
    const { data } = await circulationApi.get<FinesResponse>(`/loan/fines/${userId}`);
    return data;
  },

  /**
   * POST /loan/return - Return a borrowed book
   * Access: librarian only
   */
  async returnBook(loanId: string): Promise<ReturnResponse> {
    const requestBody: ReturnRequest = { loanId };
    const { data } = await circulationApi.post<ReturnResponse>('/loan/return', requestBody);
    return data;
  },
};
