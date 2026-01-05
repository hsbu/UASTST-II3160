'use client';

import React from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import { LoadingState, Alert } from '../ui';

interface BookListProps {
  books: Book[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  isLibrarian?: boolean;
  emptyMessage?: string;
}

export default function BookList({
  books,
  isLoading = false,
  error = null,
  onDelete,
  showActions = true,
  isLibrarian = false,
  emptyMessage = 'No books found.',
}: BookListProps) {
  if (isLoading) {
    return <LoadingState message="Loading books..." />;
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading books">
        {error}
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onDelete={onDelete}
          showActions={showActions}
          isLibrarian={isLibrarian}
        />
      ))}
    </div>
  );
}
