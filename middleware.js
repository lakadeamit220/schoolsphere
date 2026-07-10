import { NextResponse } from "next/server";

// Simple JWT decode (without full verification -- middleware runs at the edge)
// Full verification happens in getCurrentUser() on the server
function decodeJwtPayload(token) {
  try {
    let payload = token.split(".")[1];
    
    // JWTs are base64url encoded. We must convert them to standard base64
    // by replacing '-' with '+' and '_' with '/' before using atob().
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    
    // Add missing '=' padding if necessary
    const pad = payload.length % 4;
    if (pad) {
      if (pad === 1) throw new Error("Invalid base64url length");
      payload += new Array(5 - pad).join("=");
    }

    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("JWT Decode Error in Middleware:", error);
    return null;
  }
}

// Define which roles can access which route prefixes
const ROLE_ROUTE_MAP = {
  "/dashboard/students": ["ADMIN"],
  "/dashboard/teachers": ["ADMIN"],
  "/dashboard/attendance": ["ADMIN", "TEACHER"],
  "/dashboard/fees": ["ADMIN"],
  "/dashboard/settings": ["ADMIN"],
  "/dashboard": ["ADMIN", "TEACHER", "STUDENT"], // Base dashboard is open to all
};

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = path.startsWith("/dashboard");
  const isAuthRoute = path === "/login";

  const token = request.cookies.get("schoolsphere_token")?.value;

  // 1. No token + trying to access dashboard -> go to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Has token + trying to access login -> go to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Role-based route protection for dashboard sub-routes
  if (isProtectedRoute && token) {
    const payload = decodeJwtPayload(token);

    if (!payload || !payload.role) {
      // Invalid token -> clear it and go to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("schoolsphere_token");
      return response;
    }

    const userRole = payload.role;

    // Check specific routes (most specific first)
    // We iterate through the map and find the most specific match
    const matchingRoutes = Object.keys(ROLE_ROUTE_MAP)
      .filter((route) => path.startsWith(route))
      .sort((a, b) => b.length - a.length); // Sort by length, longest first

    if (matchingRoutes.length > 0) {
      const bestMatch = matchingRoutes[0];
      const allowedRoles = ROLE_ROUTE_MAP[bestMatch];

      if (!allowedRoles.includes(userRole)) {
        // User does not have permission -> redirect to base dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
