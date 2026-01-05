'use client';

import React, { useState } from 'react';
import { useToast } from '@/context';
import { useReturnBook } from '@/hooks';
import { ProtectedRoute, RoleGuard } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { ReturnForm } from '@/components/loans';
import { Card, CardContent } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';

export default function ReturnsPage() {
  const { showToast } = useToast();
  const returnBookMutation = useReturnBook();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReturn = async (loanId: string) => {
    setError(null);
    setSuccess(null);
    
    try {
      const result = await returnBookMutation.mutateAsync(loanId);
      setSuccess(`Book returned successfully at ${new Date(result.returnedAt).toLocaleString()}`);
      showToast('Book returned successfully', 'success');
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
          title="Process Returns"
          description="Process book returns for library members"
        />

        <Card className="max-w-2xl">
          <CardContent>
            <ReturnForm
              onSubmit={handleReturn}
              isSubmitting={returnBookMutation.isPending}
              error={error}
              success={success}
            />
          </CardContent>
        </Card>

        <Card className="max-w-2xl mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-3">Return Process</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Get the loan ID from the member&apos;s loan receipt or check their fines page</li>
              <li>Enter the loan ID in the form above</li>
              <li>Click &quot;Process Return&quot; to complete the return</li>
              <li>Any applicable fines will be calculated based on the return date</li>
            </ol>
          </CardContent>
        </Card>
      </RoleGuard>
    </ProtectedRoute>
  );
}
