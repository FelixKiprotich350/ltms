import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    const categories = await prisma.productPackUnit.findMany({
      where: { uuid: uuid },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    prisma.$disconnect();
  }
}
