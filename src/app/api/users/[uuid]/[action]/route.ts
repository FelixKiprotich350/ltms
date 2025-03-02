import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "lib/prisma";
import { hasPermissions } from "lib/authTask";

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string; uuid: string } }
) {
  const authresponse = await hasPermissions(req, ["manage_users"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }
  const { action, uuid } = params;

  if (!uuid || !action) {
    return NextResponse.json(
      { error: "UUID and action parameters are required" },
      { status: 400 }
    );
  }

  try {
    let updatedUser;

    if (action === "approve") {
      updatedUser = await prisma.ltmsUser.update({
        where: { uuid },
        data: { approvalStatus: "APPROVED" },
      });
    } else if (action === "disable") {
      updatedUser = await prisma.ltmsUser.update({
        where: { uuid },
        data: { loginStatus: "DISABLED" },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Allowed actions: approve, disable" },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
