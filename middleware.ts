import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes
const PUBLIC_ROUTES = ['/login', '/api-docs'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static files and assets
  if (
    pathname.startsWith('/_next') || // Exclude Next.js internal assets
    pathname.startsWith('/favicon.ico') || // Favicon
    pathname.startsWith('/public') // Exclude public folder assets (if applicable)
  ) {
    return NextResponse.next();
  }

  // Check if the route is public
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next(); // Allow access
  }

  // Check if user is authenticated
  const token = request.cookies.get('authToken'); // Replace with your authentication token logic
  if (!token) {
    // If not authenticated, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to protected routes
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: '/((?!api/|_next/).*)', // Exclude API and Next.js internal assets
};
