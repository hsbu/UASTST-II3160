'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context';
import { UserRole } from '@/types';
import { Input, Select, Button, Alert, Card, CardHeader, CardTitle, CardContent } from '../ui';

const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['member', 'librarian'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      role: 'member',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.userId, data.role as UserRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'librarian', label: 'Librarian' },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to Library System</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          {error && (
            <Alert variant="error" title="Login Failed">
              {error}
            </Alert>
          )}

          <Input
            label="User ID"
            placeholder="Enter your user ID"
            error={errors.userId?.message}
            {...register('userId')}
          />

          <Select
            label="Role"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>Member: Any user ID with role &quot;member&quot;</li>
            <li>Librarian: Any user ID with role &quot;librarian&quot;</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
