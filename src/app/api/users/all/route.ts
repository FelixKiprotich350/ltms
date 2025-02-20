import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const users = await prisma.ltmsUser.findMany({
    include: {
      Person: true,
      Department: true, 
    },
  });
  return NextResponse.json(users);
}
