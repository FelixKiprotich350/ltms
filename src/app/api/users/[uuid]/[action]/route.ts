import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { action: string; uuid: string } }
) {
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
      updatedUser = await prisma.trtUser.update({
        where: { uuid },
        data: { approvalStatus: "APPROVED" },
      });
    } else if (action === "disable") {
      updatedUser = await prisma.trtUser.update({
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
  finally{
    prisma.$disconnect();
  }
}
