import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Fetch all products
    const allProducts = await prisma.product.findMany({});

    // Fetch stock received and sales
    const stockReceived = await prisma.stockReceived.groupBy({
      by: ["productUuid"],
      _sum: { quantity: true },
    });

    const itemsSold = await prisma.productSale.groupBy({
      by: ["productUuid"],
      _sum: { quantity: true },
    });

    // Map products and calculate total received and sold
    const productsWithStats = allProducts.map((product) => {
      const received =
        stockReceived.find((item) => item.productUuid === product.uuid)?._sum
          .quantity || 0;

      const sold =
        itemsSold.find((item) => item.productUuid === product.uuid)?._sum
          .quantity || 0;

      return {
        ...product,
        totalReceived: received,
        totalSold: sold,
      };
    });

    return NextResponse.json(productsWithStats);
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
