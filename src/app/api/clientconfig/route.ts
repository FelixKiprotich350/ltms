import prisma from "lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const product = await prisma.clientConfiguration.findFirst();
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  finally{
      prisma.$disconnect();
    }
}