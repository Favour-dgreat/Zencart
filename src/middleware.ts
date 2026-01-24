// proxy.ts - UPDATED VERSION
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/order(.*)",
  "/api/orders(.*)",
  "/mock-users(.*)",
]);

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/orders(.*)",
  "/api/products(.*)",
  "/api/webhooks(.*)",
  "/cartstore(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const { userId } = await auth();
  
  // Skip auth checks for public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  // Handle protected routes
  if (isProtectedRoute(req)) {
    // If user is not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", url.pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // User is authenticated, allow access
    return NextResponse.next();
  }
  
  // For all other routes, just continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};