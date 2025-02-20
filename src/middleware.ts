import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    // Extract session token from the request
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If there is no session, redirect or return unauthorized response
    if (!session) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({ error: { message: "Authentication required" } }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      
      console.log("Redirecting to login page...");
      return NextResponse.redirect(new URL("/signing", req.url));
    }

    // User is authenticated, continue request
    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ error: { message: "Authentication error" } }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.redirect(new URL("/signing", req.url));
  }
}

// Apply middleware only to protected routes
export const config = {
  matcher: [
    "/dashboard",
    "/pos/:path*",
    "/settings/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/inventory/:path*",
  ],
};
