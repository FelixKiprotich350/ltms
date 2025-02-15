import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyAuth } from "lib/auth"; // Make sure this handles token verification properly

const SECRET_KEY = process.env.JWT_SECRET!; // Store in .env

export async function middleware(req: NextRequest) {
  try {
    // Validate the user is authenticated
    const verifiedToken = await verifyAuth(req);

    // If the token is not verified, respond accordingly
    if (!verifiedToken) {
      // If it's an API request, return a 401 Unauthorized response
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({ error: { message: "Authentication required" } }),
          { status: 401 }
        );
      }

      // Otherwise, redirect to the login page
      return NextResponse.redirect(new URL("/signing", req.url));
    }

    // If token is valid, continue the request
    return NextResponse.next();
  } catch (error: any) {
    console.error("Authentication error:", error.message); // No need for optional chaining here

    // Handle errors, perhaps from `verifyAuth`
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ error: { message: "Authentication error" } }),
        { status: 500 }
      );
    }
    console.log("redirecting to loginpage");
    // Redirect for non-API requests on errors
    return NextResponse.redirect(new URL("/signing", req.url));
  }
}

export const config = {
  runtime: "nodejs", // Ensures Node.js runtime for this middleware
  matcher: [
    "/dashboard",
    "/pos/:path*",
    "/settings/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/inventory/:path*",
  ], // Match all routes except static files
};
