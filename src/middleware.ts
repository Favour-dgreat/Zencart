// middleware.ts (or src/middleware.ts)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/order(.*)",
  "/api/orders(.*)",
  "/cart(.*)",
  "/api/stripe(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const session = await auth();
    if (!session.userId) {
      // Redirect to Clerk sign-in page if not authenticated
      return Response.redirect("/sign-in");
    }
  }
  // Public routes (including homepage) continue automatically
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};