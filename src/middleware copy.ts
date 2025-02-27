import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl;
    const token = req.nextauth?.token;

    if (!token) return NextResponse.redirect(new URL("/signing", req.url));

    // // Role-based access control
    // const { role } = token;

    // const adminRoutes = ["/admin", "/reports"];
    // if (
    //   adminRoutes.some((route) => url.pathname.startsWith(route)) &&
    //   role !== "admin"
    // ) {
    //   return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/signing", // Redirect users to login if not authenticated
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
  ], // Protect these routes
};
