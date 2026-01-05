import React from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import { Card, CardContent, Badge, Button } from '../ui';

interface BookCardProps {
  book: Book;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  isLibrarian?: boolean;
}

export default function BookCard({
  book,
  onDelete,
  showActions = false,
  isLibrarian = false,
}: BookCardProps) {
  const genres = book.genres.split(',').map((g) => g.trim());

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Link href={`/books/${book.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                {book.title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-gray-600">by {book.authors}</p>
            <p className="mt-1 text-sm text-gray-500">Published: {book.year}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              {genres.map((genre, index) => (
                <Badge key={index} variant="info">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {showActions && (
            <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
              <Link href={`/books/${book.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  View
                </Button>
              </Link>
              {isLibrarian && (
                <>
                  <Link href={`/books/edit/${book.id}`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  {onDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(book.id)}
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
