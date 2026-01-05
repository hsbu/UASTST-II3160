'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth, useToast } from '@/context';
import { useCreateLoan } from '@/hooks';
import { ProtectedRoute } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { LoanForm } from '@/components/loans';
import { Card, CardContent, Alert } from '@/components/ui';
import { LoanCreateRequest } from '@/types';
import { getApiErrorMessage } from '@/lib/api';

export default function LoansPage() {
  const { user, isMember } = useAuth();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  
  const createLoanMutation = useCreateLoan();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const prefilledBookId = searchParams.get('bookId');

  const handleSubmit = async (data: LoanCreateRequest) => {
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await createLoanMutation.mutateAsync(data);
      setSuccessMessage(
        `Loan created successfully! Loan ID: ${result.loanId}. Due date: ${new Date(result.dueAt).toLocaleDateString()}`
      );
      showToast('Loan created successfully', 'success');
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <ProtectedRoute>
      <PageHeader
        title="Create Loan"
        description="Borrow a book from the library"
      />

      {prefilledBookId && (
        <Alert variant="info" className="mb-4">
          Book ID {prefilledBookId} has been pre-filled for you.
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mb-4" title="Loan Created">
          {successMessage}
        </Alert>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <LoanForm
            defaultUserId={user?.userId}
            onSubmit={handleSubmit}
            isSubmitting={createLoanMutation.isPending}
            error={error}
            isMember={isMember}
          />
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto mt-6">
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">Loan Policy</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Maximum active loans per user: <strong>3</strong></li>
            <li>Default loan period: <strong>7 days</strong></li>
            <li>Maximum loan period: <strong>30 days</strong></li>
            <li>Fine for late returns: <strong>Rp 1,000 per day</strong></li>
          </ul>
        </CardContent>
      </Card>
    </ProtectedRoute>
  );
}
