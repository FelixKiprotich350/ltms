import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const roles = await prisma.role.findMany({});
  return NextResponse.json(roles);
}
