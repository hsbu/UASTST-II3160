'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Alert } from '../ui';

const returnSchema = z.object({
  loanId: z.string().min(1, 'Loan ID is required'),
});

type ReturnFormData = z.infer<typeof returnSchema>;

interface ReturnFormProps {
  onSubmit: (loanId: string) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  success?: string | null;
}

export default function ReturnForm({
  onSubmit,
  isSubmitting = false,
  error = null,
  success = null,
}: ReturnFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
  });

  const handleFormSubmit = async (data: ReturnFormData) => {
    await onSubmit(data.loanId);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title="Success">
          {success}
        </Alert>
      )}

      <Input
        label="Loan ID"
        placeholder="Enter loan ID (e.g., L-1234567890-abc123)"
        helperText="Enter the loan ID to process the return"
        error={errors.loanId?.message}
        {...register('loanId')}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Process Return
        </Button>
      </div>
    </form>
  );
}
