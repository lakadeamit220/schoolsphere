import { NextResponse } from "next/server";

// This function runs before EVERY page load
export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define which paths are protected (require login)
  const isProtectedRoute = path.startsWith("/dashboard");
  
  // Define which paths are public/auth (shouldn't be accessed if already logged in)
  const isAuthRoute = path === "/login" || path === "/register";

  // Get the token from cookies (Simple Custom Logic)
  const token = request.cookies.get("schoolsphere_token")?.value;

  // 1. If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If trying to access login/register WITH a token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to continue normally
  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
