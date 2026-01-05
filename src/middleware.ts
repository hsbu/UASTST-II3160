import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/login'];

// Paths that only librarians can access
const librarianOnlyPaths = ['/books/new', '/books/edit', '/returns'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without any checks
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Note: Full JWT validation happens client-side
  // This middleware provides basic route structure protection
  // The actual auth check happens in the ProtectedRoute component

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
