'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context';
import { useCreateBook } from '@/hooks';
import { ProtectedRoute, RoleGuard } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { BookForm } from '@/components/books';
import { Card, CardContent } from '@/components/ui';
import { BookCreateInput } from '@/types';
import { getApiErrorMessage } from '@/lib/api';

export default function NewBookPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createBookMutation = useCreateBook();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: BookCreateInput) => {
    setError(null);
    try {
      await createBookMutation.mutateAsync(data);
      showToast('Book created successfully', 'success');
      router.push('/books');
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['librarian']}>
        <PageHeader
          title="Add New Book"
          description="Create a new book entry in the catalog"
        />

        <Card className="max-w-2xl">
          <CardContent>
            <BookForm
              onSubmit={handleSubmit}
              isSubmitting={createBookMutation.isPending}
              error={error}
              submitLabel="Create Book"
            />
          </CardContent>
        </Card>
      </RoleGuard>
    </ProtectedRoute>
  );
}
