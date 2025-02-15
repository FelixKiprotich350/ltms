import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Midnight
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    // Fetch sales for today
    const units = await prisma.productSale.findMany({
      where: {
        createdAt: {
          gte: startOfDay, // Greater than or equal to the start of the day
          lte: endOfDay, // Less than or equal to the end of the day
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        InventoryProduct: {
          include: {
            Category: true, // Fetch related category
          },
        },
      },
    });

    return NextResponse.json(units);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  } finally {
    prisma.$disconnect();
  }
}
