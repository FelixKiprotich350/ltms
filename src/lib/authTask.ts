import { authOptions } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import apiRoutePermissions from "./apiRoutesPermissions";
import { AuthorizeApiResponse } from "types";

export async function hasPermissions(
  request: NextRequest,
  requiredPermissions: string[]
): Promise<AuthorizeApiResponse> {
  try {
    // Validate request path
    if (!request.nextUrl.pathname.startsWith("/api/")) {
      return unauthorizedResponse(
        "Authentication for API",
        "This authentication is for APIs only",
        400
      );
    }

    // Fetch session
    const session = await getServerSession(authOptions);
    if (!session) {
      return unauthorizedResponse(
        "Authentication Required",
        "The user is unauthenticated",
        401
      );
    }

    // Treat empty permissions array as missing required permissions
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return unauthorizedResponse(
        "Forbidden: Missing Permissions",
        "No permissions were provided for this request.",
        403
      );
    }

    //bad request for invalid permissions
    if (requiredPermissions.some((perm) => perm.trim() === "")) {
      return unauthorizedResponse(
        "Invalid Permission Format",
        "One or more permissions are empty strings. Please provide valid permissions.",
        400
      );
    }

    // Extract user permissions
    const userPermissions =
      session?.user?.UserPermissions?.map(
        (perm: any) => perm?.PermissionMaster?.codeName
      ) || [];

    // Check if user has any required permission
    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return unauthorizedResponse(
        "Forbidden: Insufficient permissions",
        `One of the following permissions is required: ${requiredPermissions.join(
          ", "
        )}`,
        403
      );
    }

    return successResponse("Authorized", session);
  } catch (error) {
    console.error("Authorization Error:", error);
    return unauthorizedResponse(
      "Error Occurred While Authorizing",
      "An unexpected error occurred",
      500
    );
  }
}

// Helper function for unauthorized responses
function unauthorizedResponse(
  title: string,
  description: string,
  status: number
): AuthorizeApiResponse {
  return {
    isAuthorized: false,
    message: new NextResponse(
      JSON.stringify({ error: { title, description } }),
      { status, headers: { "Content-Type": "application/json" } }
    ),
  };
}

// Helper function for successful responses
function successResponse(
  title: string,
  description: any
): AuthorizeApiResponse {
  return {
    isAuthorized: true,
    message: new NextResponse(
      JSON.stringify({ data: { title, description } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ),
  };
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
