// Book types - matches cataloging.js API responses

export interface Book {
  id: number;
  title: string;
  genres: string;
  authors: string;
  year: number;
}

export interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

export interface BookResponse {
  success: boolean;
  data: Book;
}

export interface BookMutationResponse {
  success: boolean;
  message: string;
  data?: Book;
}

export interface BookStats {
  totalBooks: number;
  oldestYear: number;
  newestYear: number;
}

export interface BookStatsResponse {
  success: boolean;
  data: BookStats;
}

export type BookCreateInput = Omit<Book, 'id'>;
export type BookUpdateInput = Omit<Book, 'id'>;
