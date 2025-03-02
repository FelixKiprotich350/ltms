import { hasPermissions } from "lib/authTask";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authresponse = await hasPermissions(request, ["manage_users"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }
  const permissions = await prisma.permissionMaster.findMany({});
  return NextResponse.json(permissions);
}
