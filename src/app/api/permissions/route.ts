import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const permissions = await prisma.permissionMaster.findMany({});
  return NextResponse.json(permissions);
}
