import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

function generateSaleNumber(): string {
  const timestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp in seconds
  return `S-${timestamp}`;
}

export async function GET(
  req: Request,
  { params }: { params: { uuid: string } }
) {
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
    },
  });

  return NextResponse.json(user);
}
 