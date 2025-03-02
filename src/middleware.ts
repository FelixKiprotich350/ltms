import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import apiRoutePermissions from "lib/apiRoutesPermissions";

export async function middleware(req: NextRequest) {
  try {
    // Extract the session token from the request
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    // If there is no session, redirect or return unauthorized response
    if (!session) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({ error: { message: "Authentication required" } }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      return NextResponse.redirect(new URL("/signing", req.url));
    }

    // User is authenticated, continue the validation
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const resource = apiRoutePermissions.find(
        (r) => r.route === req.nextUrl.pathname
      );
      console.log(req.nextUrl.pathname);
      if (!resource) {
        return new NextResponse(
          JSON.stringify({
            error: {
              title: "The resource does not exist",
              description: req.nextUrl.toString(),
            },
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      } else {
        const methodPermissions =
          resource?.methods.find((m) => m.method === req.method)?.permissions ||
          [];

        const userPermissions = session?.permissions || []; // Ensure session has permissions

        const hasPermission = methodPermissions.some((perm) =>
          (userPermissions as Array<any>).some(
            (userPerm: any) => userPerm?.PermissionMaster?.codeName === perm
          )
        );

        if (!hasPermission) {
          return new NextResponse(
            JSON.stringify({
              error: {
                message: {
                  title:
                    "Forbidden: Insufficient permissions. The following Permisions are required",
                  description: methodPermissions,
                },
              },
            }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
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
    "/dashboard/:path*",
    "/recipients/:path*",
    "/requests/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/tickets/:path*",
    "/users/:path*",
    "/myaccount/:path*",
    "/notifications/:path*",
    "/api/dashboard/:path*",
    "/api/admin/:path*",
    "/api/tickets/:path*",
    "/api/reports/:path*",
    "/api/letterrequests/:path*",
    "/api/recipients/:path*",
    "/api/users/:path*",
    "/api/myaccount/:path*",
    "/api/notifications/:path*",
  ],
};
