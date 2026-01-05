'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { circulationService } from '@/lib/api';
import { LoanCreateRequest } from '@/types';

// Query keys for caching
export const loanKeys = {
  all: ['loans'] as const,
  fines: () => [...loanKeys.all, 'fines'] as const,
  userFines: (userId: string) => [...loanKeys.fines(), userId] as const,
  health: () => [...loanKeys.all, 'health'] as const,
};

/**
 * Hook to fetch fines for a specific user
 */
export function useFines(userId: string) {
  return useQuery({
    queryKey: loanKeys.userFines(userId),
    queryFn: () => circulationService.getFines(userId),
    enabled: !!userId && userId.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new loan
 */
export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoanCreateRequest) => circulationService.createLoan(request),
    onSuccess: (_, variables) => {
      // Invalidate user's fines as they now have a new loan
      queryClient.invalidateQueries({ queryKey: loanKeys.userFines(variables.userId) });
    },
  });
}

/**
 * Hook to return a book (librarian only)
 */
export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: string) => circulationService.returnBook(loanId),
    onSuccess: () => {
      // Invalidate all fines queries as we don't know which user
      queryClient.invalidateQueries({ queryKey: loanKeys.fines() });
    },
  });
}

/**
 * Hook to check service health
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: loanKeys.health(),
    queryFn: () => circulationService.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    retry: false,
  });
}
  