import { NextResponse } from "next/server";
import prisma from "lib/prisma";

// GET: Fetch top 10 selling products
export async function GET() {
  try {
    const allCaegories = await prisma.letterCategory.findMany();
     // Group sales by productUuid and calculate total quantity sold
    const topSellingProducts = await prisma.letterRequest.findMany();
  
      
    return NextResponse.json(
      { "message":"success"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
