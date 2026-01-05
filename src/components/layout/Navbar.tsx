'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLibrarian, logout } = useAuth();

  const navLinks = [
    { href: '/books', label: 'Books' },
    { href: '/loans', label: 'My Loans' },
    { href: '/fines', label: 'Fines' },
    { href: '/stats', label: 'Statistics' },
  ];

  // Librarian-only links
  const librarianLinks = [
    { href: '/returns', label: 'Returns' },
  ];

  const allLinks = isLibrarian ? [...navLinks, ...librarianLinks] : navLinks;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Nav Links */}
          <div className="flex items-center">
            <Link href="/books" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">Library</span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    User: <strong>{user.userId}</strong>
                  </span>
                  <Badge variant={isLibrarian ? 'info' : 'default'}>
                    {user.role}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isAuthenticated && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
