'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useToast } from '@/context';
import { useBook, useDeleteBook } from '@/hooks';
import { ProtectedRoute } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, Badge, Button, Alert, LoadingState } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLibrarian } = useAuth();
  const { showToast } = useToast();
  
  const bookId = parseInt(params.id as string);
  const { data, isLoading, error } = useBook(bookId);
  const deleteBookMutation = useDeleteBook();

  const book = data?.data;
  const genres = book?.genres.split(',').map((g) => g.trim()) || [];

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await deleteBookMutation.mutateAsync(bookId);
      showToast('Book deleted successfully', 'success');
      router.push('/books');
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingState message="Loading book details..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Alert variant="error" title="Error loading book">
          {getApiErrorMessage(error)}
        </Alert>
        <div className="mt-4">
          <Link href="/books">
            <Button variant="secondary">Back to Books</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  if (!book) {
    return (
      <ProtectedRoute>
        <Alert variant="warning" title="Book not found">
          The requested book could not be found.
        </Alert>
        <div className="mt-4">
          <Link href="/books">
            <Button variant="secondary">Back to Books</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageHeader
        title={book.title}
        actions={
          <div className="flex gap-2">
            <Link href="/books">
              <Button variant="secondary">Back to Books</Button>
            </Link>
            {isLibrarian && (
              <>
                <Link href={`/books/edit/${book.id}`}>
                  <Button variant="ghost">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={deleteBookMutation.isPending}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        }
      />

      <Card>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Book ID</dt>
              <dd className="mt-1 text-lg text-gray-900">{book.id}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Publication Year</dt>
              <dd className="mt-1 text-lg text-gray-900">{book.year}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Author(s)</dt>
              <dd className="mt-1 text-lg text-gray-900">{book.authors}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Genre(s)</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                  <Badge key={index} variant="info">
                    {genre}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link href={`/loans?bookId=${book.id}`}>
                <Button variant="primary">Borrow This Book</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
