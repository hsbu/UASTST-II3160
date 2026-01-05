'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/context';
import { useBook, useUpdateBook } from '@/hooks';
import { ProtectedRoute, RoleGuard } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { BookForm } from '@/components/books';
import { Card, CardContent, LoadingState, Alert } from '@/components/ui';
import { BookUpdateInput } from '@/types';
import { getApiErrorMessage } from '@/lib/api';

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const bookId = parseInt(params.id as string);
  const { data, isLoading, error: fetchError } = useBook(bookId);
  const updateBookMutation = useUpdateBook();
  const [error, setError] = useState<string | null>(null);

  const book = data?.data;

  const handleSubmit = async (bookData: BookUpdateInput) => {
    setError(null);
    try {
      await updateBookMutation.mutateAsync({ id: bookId, book: bookData });
      showToast('Book updated successfully', 'success');
      router.push(`/books/${bookId}`);
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingState message="Loading book details..." />
      </ProtectedRoute>
    );
  }

  if (fetchError || !book) {
    return (
      <ProtectedRoute>
        <Alert variant="error" title="Error loading book">
          {fetchError ? getApiErrorMessage(fetchError) : 'Book not found'}
        </Alert>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['librarian']}>
        <PageHeader
          title={`Edit: ${book.title}`}
          description="Update book information"
        />

        <Card className="max-w-2xl">
          <CardContent>
            <BookForm
              initialData={book}
              onSubmit={handleSubmit}
              isSubmitting={updateBookMutation.isPending}
              error={error}
              submitLabel="Update Book"
            />
          </CardContent>
        </Card>
      </RoleGuard>
    </ProtectedRoute>
  );
}
