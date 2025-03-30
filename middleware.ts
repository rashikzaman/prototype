import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  "/contact",
  "/about",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);

  const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

  // If the user is not logged in and trying to access pages other than /auth, then redirect the user to the auth page
  if (
    !userId &&
    !(url.pathname === authRoutes[0] || url.pathname === authRoutes[1])
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Redirect authenticated users from "/" to "/tasks"
  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL("/tasks", req.url));
  }

  // Protect all non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
