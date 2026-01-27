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

export default clerkMiddleware(async (auth, req) => {
  // Protect routes: redirect unauthenticated users to sign-in
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
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