import { catalogingApi } from './client';
import {
  Book,
  BooksResponse,
  BookResponse,
  BookMutationResponse,
  BookStatsResponse,
  BookCreateInput,
  BookUpdateInput,
} from '@/types';

/**
 * Cataloging Service - Book Management API
 * Connects to cataloging.js backend
 */
export const catalogingService = {
  /**
   * GET /api/books - Get all books
   * Access: member, librarian
   */
  async getAllBooks(): Promise<BooksResponse> {
    const { data } = await catalogingApi.get<BooksResponse>('/api/books');
    return data;
  },

  /**
   * GET /api/books/:id - Get a single book by ID
   * Access: member, librarian
   */
  async getBookById(id: number): Promise<BookResponse> {
    const { data } = await catalogingApi.get<BookResponse>(`/api/books/${id}`);
    return data;
  },

  /**
   * GET /api/books/genres/:genres - Search books by genre
   * Access: member, librarian
   */
  async searchByGenre(genre: string): Promise<BooksResponse> {
    const { data } = await catalogingApi.get<BooksResponse>(
      `/api/books/genres/${encodeURIComponent(genre)}`
    );
    return data;
  },

  /**
   * GET /api/books/year/:year - Search books by publication year
   * Access: member, librarian
   */
  async searchByYear(year: number): Promise<BooksResponse> {
    const { data } = await catalogingApi.get<BooksResponse>(`/api/books/year/${year}`);
    return data;
  },

  /**
   * GET /api/books/author/:author - Search books by author
   * Access: member, librarian
   */
  async searchByAuthor(author: string): Promise<BooksResponse> {
    const { data } = await catalogingApi.get<BooksResponse>(
      `/api/books/author/${encodeURIComponent(author)}`
    );
    return data;
  },

  /**
   * POST /api/books - Create a new book
   * Access: librarian only
   */
  async createBook(book: BookCreateInput): Promise<BookMutationResponse> {
    const { data } = await catalogingApi.post<BookMutationResponse>('/api/books', book);
    return data;
  },

  /**
   * PUT /api/books/:id - Update an existing book
   * Access: librarian only
   */
  async updateBook(id: number, book: BookUpdateInput): Promise<BookMutationResponse> {
    const { data } = await catalogingApi.put<BookMutationResponse>(`/api/books/${id}`, book);
    return data;
  },

  /**
   * DELETE /api/books/:id - Delete a book
   * Access: librarian only
   */
  async deleteBook(id: number): Promise<BookMutationResponse> {
    const { data } = await catalogingApi.delete<BookMutationResponse>(`/api/books/${id}`);
    return data;
  },

  /**
   * GET /api/stats - Get books statistics
   * Access: member, librarian
   */
  async getStats(): Promise<BookStatsResponse> {
    const { data } = await catalogingApi.get<BookStatsResponse>('/api/stats');
    return data;
  },
};
