import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes (add more as needed)
const isProtectedRoute = createRouteMatcher([
  "/order(.*)",
  "/api/orders(.*)",
  "/cart(.*)",
  "/api/stripe(.*)",
  // Add any other protected paths, e.g. "/profile(.*)", "/dashboard(.*)"
]);

// Optional: Define public routes explicitly (prevents loops)
const isPublicRoute = createRouteMatcher([
  "/",              // homepage
  "/sign-in(.*)",   // Clerk's sign-in page
  "/sign-up(.*)",   // if you use sign-up
  // Add other public paths like "/about", "/products", etc.
]);

export default clerkMiddleware((auth, req) => {
  // Protect routes: redirect unauthenticated users to sign-in
  if (isProtectedRoute(req)) {
    auth().protect();  // ← Clerk's built-in: redirects to sign-in if !userId, handles orgs too
  }

  // Optional: For public routes, just continue (or add custom logic)
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Run middleware on almost everything except static files & Next internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)).*)",
    // Include root and API routes explicitly if needed
    "/",
    "/(api|trpc)(.*)",
  ],
};