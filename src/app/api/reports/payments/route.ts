import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Fetch all products
    const allpayments = await prisma.salesPayments.findMany({});

    return NextResponse.json(allpayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
