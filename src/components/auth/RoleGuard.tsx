'use client';

import React from 'react';
import { useAuth } from '@/context';
import { UserRole } from '@/types';
import { Alert } from '../ui';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Alert variant="warning" title="Access Denied">
        You do not have permission to access this content.
        Required role: {allowedRoles.join(' or ')}.
      </Alert>
    );
  }

  return <>{children}</>;
}
