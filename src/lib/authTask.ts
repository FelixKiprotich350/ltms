import { authOptions } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import apiRoutePermissions from "./apiRoutesPermissions";


export async function hasPermissions(
  request: NextRequest,
  requiredPermissions: Array<string>
): Promise<any> {
  try {
    const session = await getServerSession(authOptions);

    if (!request.nextUrl.pathname.startsWith("/api/")) {
      return {
        isAuthorized: false,
        message: new NextResponse(
          JSON.stringify({
            error: { message: "this Authentication is for APIs only" },
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        ),
      };
    }
    if (!session) {
      return {
        isAuthorized: false,
        message: new NextResponse(
          JSON.stringify({ error: { message: "Authentication required" } }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    const userPermissions = session?.user?.UserPermissions || []; // Ensure session has permissions

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.some(
        (userPerm: any) => userPerm?.PermissionMaster?.codeName === perm
      )
    );

    if (!hasPermission) {
      return {
        isAuthorized: false,
        message: new NextResponse(
          JSON.stringify({
            error: {
              message: {
                title:
                  "Forbidden: Insufficient permissions. One of The following Permisions are required",
                description: requiredPermissions,
              },
            },
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    return { isAuthorized: hasPermission, message: null }; // ✅ Ensure the function returns the result
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

export async function hasRole(role: string): Promise<boolean> {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.UserRole) return false;

    return session.user.UserRole.codeName === role;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}