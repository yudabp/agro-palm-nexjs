import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/api/master',
  '/api/produksi',
  '/api/penjualan',
  '/api/karyawan',
  '/api/keuangan',
  '/api/hutang',
];

// Define routes that require specific roles
const roleBasedRoutes = {
  // Direksi (read-only) can access all routes but only for GET requests
  direksiWriteProtected: {
    methods: ['POST', 'PUT', 'DELETE', 'PATCH'],
    routes: [
      '/api/master',
      '/api/produksi',
      '/api/penjualan',
      '/api/karyawan',
      '/api/keuangan',
      '/api/hutang',
    ],
  },
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, auth routes, and public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/favicon') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Get the session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If no session, redirect to sign-in
    if (!session) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has role assignments
    if (!session.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // For API routes, check role-based permissions
    if (pathname.startsWith('/api/')) {
      const method = request.method;

      // Check if this is a write operation that might be restricted for Direksi role
      if (roleBasedRoutes.direksiWriteProtected.methods.includes(method)) {
        try {
          // Query user role from database
          const response = await fetch(`${request.nextUrl.origin}/api/user/role`, {
            headers: {
              'Cookie': request.headers.get('cookie') || '',
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            return NextResponse.json(
              { error: 'Failed to verify user role' },
              { status: 500 }
            );
          }

          const { role } = await response.json();

          // If user is Direksi and trying to write data, deny access
          if (role === 'Direksi') {
            return NextResponse.json(
              {
                error: 'Insufficient permissions',
                message: 'Direksi role has read-only access',
              },
              { status: 403 }
            );
          }
        } catch (error) {
          console.error('Role verification error:', error);
          // Continue with request if role verification fails (fail-safe)
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};