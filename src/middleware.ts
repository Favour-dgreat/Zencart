import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/order(.*)",
  "/api/orders(.*)",
  "/cart(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return (await auth()).redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)).*)",
  ],
};