'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth, useToast } from '@/context';
import {
  useBooks,
  useBooksByGenre,
  useBooksByAuthor,
  useBooksByYear,
  useDeleteBook,
} from '@/hooks';
import { ProtectedRoute } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { BookList, BookSearch } from '@/components/books';
import { Button } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';

type SearchType = 'all' | 'genre' | 'author' | 'year';

export default function BooksPage() {
  const { isLibrarian } = useAuth();
  const { showToast } = useToast();
  
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Queries based on search type
  const allBooksQuery = useBooks();
  const genreQuery = useBooksByGenre(searchType === 'genre' ? searchQuery : '');
  const authorQuery = useBooksByAuthor(searchType === 'author' ? searchQuery : '');
  const yearQuery = useBooksByYear(searchType === 'year' ? parseInt(searchQuery) : 0);

  const deleteBookMutation = useDeleteBook();

  // Determine which query result to use
  const getActiveQuery = () => {
    switch (searchType) {
      case 'genre':
        return searchQuery ? genreQuery : allBooksQuery;
      case 'author':
        return searchQuery ? authorQuery : allBooksQuery;
      case 'year':
        return searchQuery ? yearQuery : allBooksQuery;
      default:
        return allBooksQuery;
    }
  };

  const activeQuery = getActiveQuery();
  const books = activeQuery.data?.data || [];
  const isLoading = activeQuery.isLoading;
  const error = activeQuery.error ? getApiErrorMessage(activeQuery.error) : null;

  const handleSearch = useCallback((type: SearchType, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await deleteBookMutation.mutateAsync(id);
      showToast('Book deleted successfully', 'success');
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    }
  };

  return (
    <ProtectedRoute>
      <PageHeader
        title="Books"
        description="Browse and manage library books"
        actions={
          isLibrarian && (
            <Link href="/books/new">
              <Button>Add New Book</Button>
            </Link>
          )
        }
      />

      <BookSearch onSearch={handleSearch} isLoading={isLoading} />

      <BookList
        books={books}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        showActions={true}
        isLibrarian={isLibrarian}
        emptyMessage={
          searchType === 'all'
            ? 'No books in the library yet.'
            : 'No books found matching your search criteria.'
        }
      />
    </ProtectedRoute>
  );
}
