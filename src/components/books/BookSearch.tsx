'use client';

import React, { useState } from 'react';
import { Input, Button, Select } from '../ui';

type SearchType = 'all' | 'genre' | 'author' | 'year';

interface BookSearchProps {
  onSearch: (type: SearchType, query: string) => void;
  isLoading?: boolean;
}

export default function BookSearch({ onSearch, isLoading = false }: BookSearchProps) {
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchType, searchQuery);
  };

  const handleReset = () => {
    setSearchType('all');
    setSearchQuery('');
    onSearch('all', '');
  };

  const searchOptions = [
    { value: 'all', label: 'All Books' },
    { value: 'genre', label: 'By Genre' },
    { value: 'author', label: 'By Author' },
    { value: 'year', label: 'By Year' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-40">
          <Select
            options={searchOptions}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
          />
        </div>

        <div className="flex-1">
          <Input
            placeholder={
              searchType === 'all'
                ? 'Search all books...'
                : searchType === 'genre'
                ? 'Enter genre (e.g., Fiction)'
                : searchType === 'author'
                ? 'Enter author name'
                : 'Enter year (e.g., 2020)'
            }
            type={searchType === 'year' ? 'number' : 'text'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Search
          </Button>
          {(searchType !== 'all' || searchQuery) && (
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
