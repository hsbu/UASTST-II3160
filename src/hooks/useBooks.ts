'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogingService } from '@/lib/api';
import { BookCreateInput, BookUpdateInput } from '@/types';

// Query keys for caching
export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...bookKeys.lists(), filters] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookKeys.details(), id] as const,
  stats: () => [...bookKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch all books
 */
export function useBooks() {
  return useQuery({
    queryKey: bookKeys.lists(),
    queryFn: () => catalogingService.getAllBooks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single book by ID
 */
export function useBook(id: number) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => catalogingService.getBookById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to search books by genre
 */
export function useBooksByGenre(genre: string) {
  return useQuery({
    queryKey: bookKeys.list({ genre }),
    queryFn: () => catalogingService.searchByGenre(genre),
    enabled: !!genre && genre.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to search books by year
 */
export function useBooksByYear(year: number) {
  return useQuery({
    queryKey: bookKeys.list({ year }),
    queryFn: () => catalogingService.searchByYear(year),
    enabled: !!year && year > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to search books by author
 */
export function useBooksByAuthor(author: string) {
  return useQuery({
    queryKey: bookKeys.list({ author }),
    queryFn: () => catalogingService.searchByAuthor(author),
    enabled: !!author && author.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch book statistics
 */
export function useBookStats() {
  return useQuery({
    queryKey: bookKeys.stats(),
    queryFn: () => catalogingService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new book (librarian only)
 */
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (book: BookCreateInput) => catalogingService.createBook(book),
    onSuccess: () => {
      // Invalidate and refetch books list
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookKeys.stats() });
    },
  });
}

/**
 * Hook to update a book (librarian only)
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, book }: { id: number; book: BookUpdateInput }) =>
      catalogingService.updateBook(id, book),
    onSuccess: (_, variables) => {
      // Invalidate specific book and books list
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    },
  });
}

/**
 * Hook to delete a book (librarian only)
 */
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => catalogingService.deleteBook(id),
    onSuccess: (_, id) => {
      // Remove from cache and refetch list
      queryClient.removeQueries({ queryKey: bookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookKeys.stats() });
    },
  });
}
