'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Book, BookCreateInput } from '@/types';
import { Input, Button, Alert } from '../ui';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  genres: z.string().min(1, 'Genre is required'),
  authors: z.string().min(1, 'Author is required'),
  year: z
    .number({ invalid_type_error: 'Year must be a number' })
    .int('Year must be a whole number')
    .min(1000, 'Year must be at least 1000')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: BookCreateInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel?: string;
}

export default function BookForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  submitLabel = 'Save Book',
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          genres: initialData.genres,
          authors: initialData.authors,
          year: initialData.year,
        }
      : {
          title: '',
          genres: '',
          authors: '',
          year: new Date().getFullYear(),
        },
  });

  const handleFormSubmit = async (data: BookFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <Input
        label="Title"
        placeholder="Enter book title"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        label="Author(s)"
        placeholder="Enter author name(s)"
        helperText="Separate multiple authors with commas"
        error={errors.authors?.message}
        {...register('authors')}
      />

      <Input
        label="Genre(s)"
        placeholder="Enter genre(s)"
        helperText="Separate multiple genres with commas (e.g., Fiction, Drama)"
        error={errors.genres?.message}
        {...register('genres')}
      />

      <Input
        label="Publication Year"
        type="number"
        placeholder="Enter publication year"
        error={errors.year?.message}
        {...register('year', { valueAsNumber: true })}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
