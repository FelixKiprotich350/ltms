import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productUuid, quantity, PackUnitUuid } = body;
    console.log(body);
    // Validate required fields
    if (!productUuid || !quantity || !PackUnitUuid) {
      return NextResponse.json(
        { error: "Missing required fields: productUuid, quantity, userUuid" },
        { status: 400 }
      );
    }

    //get product
    const product = await prisma.product.findFirst({
      where: { uuid: productUuid },
    });

    // Create stock received entry
    const transaction = await prisma.stockReceived.create({
      data: {
        product: { connect: { uuid: productUuid } },
        quantity,
        PackingUnit: { connect: { uuid: PackUnitUuid } },
      },
    });

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("Error creating stock received entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
