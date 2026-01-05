'use client';

import React from 'react';
import { useBookStats } from '@/hooks';
import { ProtectedRoute } from '@/components/auth';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, LoadingState, Alert } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';

export default function StatsPage() {
  const { data, isLoading, error } = useBookStats();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingState message="Loading statistics..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Alert variant="error" title="Error loading statistics">
          {getApiErrorMessage(error)}
        </Alert>
      </ProtectedRoute>
    );
  }

  const stats = data?.data;

  return (
    <ProtectedRoute>
      <PageHeader
        title="Library Statistics"
        description="Overview of library collection"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Books
              </p>
              <p className="mt-2 text-4xl font-bold text-primary-600">
                {stats?.totalBooks ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Oldest Book
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {stats?.oldestYear ?? '-'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Newest Book
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                {stats?.newestYear ?? '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">About This System</h3>
          <div className="prose prose-sm text-gray-600">
            <p>
              This Library Management System provides the following features:
            </p>
            <ul className="mt-2 space-y-1">
              <li><strong>Book Cataloging</strong> - Browse, search, and manage the book collection</li>
              <li><strong>Loan Management</strong> - Borrow and return books</li>
              <li><strong>Fine Tracking</strong> - View outstanding fines for late returns</li>
              <li><strong>Statistics</strong> - Overview of library collection</li>
            </ul>
            <p className="mt-4">
              <strong>Roles:</strong>
            </p>
            <ul className="space-y-1">
              <li><strong>Member</strong> - Can browse books, create loans for themselves, view their fines</li>
              <li><strong>Librarian</strong> - Full access including adding/editing/deleting books and processing returns</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </ProtectedRoute>
  );
}
