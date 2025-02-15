import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Fetch all products
    const allsales = await prisma.productSale.findMany({
      include: {
        InventoryProduct: true,
      },
    });

    return NextResponse.json(allsales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
