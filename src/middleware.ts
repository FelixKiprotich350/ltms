import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

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

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/recipients/:path*",
    "/requests/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/tickets/:path*",
    "/users/:path*",
    "/myaccount/:path*",
    "/notifications/:path*",
  ],
};
