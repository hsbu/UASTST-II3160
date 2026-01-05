'use client';

import React from 'react';
import { useAuth } from '@/context';
import { useFines } from '@/hooks';
import { ProtectedRoute } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { FinesSummary } from '@/components/loans';
import { getApiErrorMessage } from '@/lib/api';

export default function FinesPage() {
  const { user } = useAuth();
  const userId = user?.userId || '';
  
  const { data, isLoading, error } = useFines(userId);

  return (
    <ProtectedRoute>
      <PageHeader
        title="My Fines"
        description="View your loan history and fines"
      />

      <FinesSummary
        fines={data || null}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
      />
    </ProtectedRoute>
  );
}
