import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

import prisma from "lib/prisma";

export async function GET() {
  // Get user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
   
  const user = await prisma.ltmsUser.findUnique({
    where: {
      uuid: session.user?.uuid,
    },
    include: {
      Person: true,
      UserRole: true,
      Department: true,
    },
  });

  return NextResponse.json(user);
}
