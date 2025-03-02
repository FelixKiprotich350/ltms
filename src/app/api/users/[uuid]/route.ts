import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "lib/prisma";
import { hasPermissions } from "lib/authTask";

function generateSaleNumber(): string {
  const timestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp in seconds
  return `S-${timestamp}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { uuid: string } }
) {
  const authresponse = await hasPermissions(req, ["manage_users"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }
  const { uuid } = params; // Extract the dynamic 'group' parameter from the route

  if (!uuid) {
    return NextResponse.json(
      { error: "User UUID parameter is required" },
      { status: 400 }
    );
  }
  const user = await prisma.ltmsUser.findFirst({
    where: {
      uuid: uuid,
    },
    include: {
      Person: true,
      UserRole: true,
      Department: true,
      UserPermissions: true,
    },
  });

  return NextResponse.json(user);
}
