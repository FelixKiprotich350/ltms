import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Fetch all products
    const alltranactions = await prisma.stockReceived.findMany({
      include: { product: true },
    });

    return NextResponse.json(alltranactions);
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
