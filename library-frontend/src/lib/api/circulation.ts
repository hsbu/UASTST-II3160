import { circulationApi, catalogingApi } from './client';
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
   * POST /auth/login - Authenticate user and get JWT tokens from BOTH services
   * Access: public (no auth required)
   * 
   * This login calls both cataloging and circulation backends to get 
   * separate tokens for each service (they have different JWT secrets)
   */
  async login(userId: string, role: UserRole): Promise<LoginResponse> {
    const requestBody: LoginRequest = { userId, role };
    
    // Login to BOTH services in parallel to get separate tokens
    const [circulationResponse, catalogingResponse] = await Promise.all([
      circulationApi.post<LoginResponse>('/auth/login', requestBody),
      catalogingApi.post<LoginResponse>('/auth/login', requestBody),
    ]);
    
    // Store both tokens
    tokenManager.setCirculationToken(circulationResponse.data.token);
    tokenManager.setCatalogingToken(catalogingResponse.data.token);
    
    // Return circulation response (both should have same user info)
    return circulationResponse.data;
  },

  /**
   * Logout - Clear both stored tokens
   */
  logout(): void {
    tokenManager.removeTokens();
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
