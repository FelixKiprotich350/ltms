import { hasPermissions } from "lib/authTask";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authresponse = await hasPermissions(request, ["manage_users"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }
  const users = await prisma.ltmsUser.findMany({
    include: {
      Person: true,
      Department: true,
    },
  });
  return NextResponse.json(users);
}
