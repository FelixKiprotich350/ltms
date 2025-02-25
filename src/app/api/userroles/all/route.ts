import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const roles = await prisma.userRole.findMany({});
  return NextResponse.json(roles);
}
