import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const users = await prisma.trtUser.findMany({
    include: {
      Person: true,
      Role: true,
    },
  });
  return NextResponse.json(users);
}
