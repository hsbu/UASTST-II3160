'use client';

import React from 'react';
import { format } from 'date-fns';
import { FineBreakdown, FinesResponse } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Alert } from '../ui';

interface FinesSummaryProps {
  fines: FinesResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function FinesSummary({
  fines,
  isLoading = false,
  error = null,
}: FinesSummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading fines">
        {error}
      </Alert>
    );
  }

  if (!fines) {
    return (
      <Alert variant="info">
        No fines data available.
      </Alert>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Fines Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-lg font-semibold">{fines.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Loans</p>
              <p className="text-lg font-semibold">{fines.loansCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fine Per Day</p>
              <p className="text-lg font-semibold">{formatCurrency(fines.finePerDay)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Fine</p>
              <p className={`text-lg font-bold ${fines.totalFine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(fines.totalFine)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Table */}
      {fines.breakdown.length > 0 && (
        <Card padding="none">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Loan Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Returned
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Late Days
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fines.breakdown.map((item: FineBreakdown) => (
                  <tr key={item.loanId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                      {item.loanId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.bookId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(item.dueAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.returnedAt ? (
                        <span className="text-gray-600">{formatDate(item.returnedAt)}</span>
                      ) : (
                        <Badge variant="warning">Not Returned</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.lateDays > 0 ? (
                        <Badge variant="danger">{item.lateDays} days</Badge>
                      ) : (
                        <Badge variant="success">On time</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {item.fine > 0 ? (
                        <span className="text-red-600">{formatCurrency(item.fine)}</span>
                      ) : (
                        <span className="text-green-600">{formatCurrency(0)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
