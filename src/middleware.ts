import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (!token) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/signing?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/signing",
    },
  }
);

// Apply middleware only to protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/recipients/:path*",
    "/letterrequests/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/tickets/:path*",
    "/users/:path*",
    "/myaccount/:path*",
    "/notifications/:path*", 
  ],
};
