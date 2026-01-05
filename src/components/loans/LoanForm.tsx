'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoanCreateRequest } from '@/types';
import { Input, Button, Alert } from '../ui';

const loanSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  bookId: z
    .number({ invalid_type_error: 'Book ID must be a number' })
    .int('Book ID must be a whole number')
    .positive('Book ID must be positive'),
  days: z
    .number({ invalid_type_error: 'Days must be a number' })
    .int('Days must be a whole number')
    .min(1, 'Minimum loan period is 1 day')
    .max(30, 'Maximum loan period is 30 days')
    .optional(),
});

type LoanFormData = z.infer<typeof loanSchema>;

interface LoanFormProps {
  defaultUserId?: string;
  onSubmit: (data: LoanCreateRequest) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  isMember?: boolean;
}

export default function LoanForm({
  defaultUserId,
  onSubmit,
  isSubmitting = false,
  error = null,
  isMember = false,
}: LoanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      userId: defaultUserId || '',
      bookId: undefined,
      days: 7,
    },
  });

  const handleFormSubmit = async (data: LoanFormData) => {
    await onSubmit({
      userId: data.userId,
      bookId: data.bookId,
      days: data.days,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <Input
        label="User ID"
        placeholder="Enter user ID"
        error={errors.userId?.message}
        disabled={isMember}
        {...register('userId')}
      />

      <Input
        label="Book ID"
        type="number"
        placeholder="Enter book ID to borrow"
        error={errors.bookId?.message}
        {...register('bookId', { valueAsNumber: true })}
      />

      <Input
        label="Loan Period (days)"
        type="number"
        placeholder="Enter number of days"
        helperText="Default is 7 days. Maximum is 30 days."
        error={errors.days?.message}
        {...register('days', { valueAsNumber: true })}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Create Loan
        </Button>
      </div>
    </form>
  );
}
