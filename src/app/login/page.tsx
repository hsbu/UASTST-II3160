'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import { LoginForm } from '@/components/auth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/books');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
