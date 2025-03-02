import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import { hasPermissions } from "lib/authTask";

// GET: Fetch user permissions by UUID
export async function GET(
  req: NextRequest,
  { params }: { params: { uuid: string } }
) {
  const authresponse = await hasPermissions(req, ["manage_users"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }
  const { uuid: userUuid } = params;

  if (!userUuid) {
    return NextResponse.json(
      { error: "User UUID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const permissions = await prisma.userPermission.findMany({
      where: { userUuid },
    });

    return NextResponse.json(permissions, { status: 200 });
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user permissions" },
      { status: 500 }
    );
  }
}

// POST: Assign permission to a user
export async function POST(
  req: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const authresponse = await hasPermissions(req, ["manage_users"]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
    const { uuid: userUuid } = params;
    const { permissionUuid } = await req.json();

    if (!userUuid || !permissionUuid) {
      return NextResponse.json(
        { error: "User UUID and permission UUID are required" },
        { status: 400 }
      );
    }

    const permission = await prisma.userPermission.create({
      data: { userUuid, permissionUuid },
    });

    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    console.error("Error assigning permission:", error);
    return NextResponse.json(
      { error: "Failed to assign permission" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a permission by its UUID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const authresponse = await hasPermissions(req, ["manage_users"]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
    const { uuid: userUuid } = params;
    const { permissionMasterUuid } = await req.json();

    if (!permissionMasterUuid || !userUuid) {
      return NextResponse.json(
        { error: "Permission UUID and User UUID is required" },
        { status: 400 }
      );
    }
    const userPermission = await prisma.userPermission.findFirst({
      where: { userUuid, permissionUuid: permissionMasterUuid },
    });
    if (!userPermission) {
      return NextResponse.json(
        { error: "The User does not have the requested permission" },
        { status: 400 }
      );
    }
    const deletedPermission = await prisma.userPermission.delete({
      where: { uuid: userPermission?.uuid },
    });

    return NextResponse.json(deletedPermission, { status: 200 });
  } catch (error) {
    console.error("Error deleting user permission:", error);
    return NextResponse.json(
      { error: "Failed to delete user permission" },
      { status: 500 }
    );
  }
}
