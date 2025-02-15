import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

interface SellingItem extends Product {
  quantity: number;
  tax: number;
  total: number;
}

function generateSaleNumber(): string {
  const timestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp in seconds
  return `S-${timestamp}`;
}

export async function GET(
  req: Request,
  { params }: { params: { group: string } }
) {
  const { group } = params; // Extract the dynamic 'group' parameter from the route

  if (!group) {
    return NextResponse.json(
      { error: "Group parameter is required" },
      { status: 400 }
    );
  }
  const sales = await prisma.basketSale.findMany({
    where: {
      groupCode: group,
    },
  });

  return NextResponse.json(sales);
}

export async function DELETE(
  req: Request,
  { params }: { params: { group: string } }
) {
  const { group } = params;
  try {
    const { count } = await prisma.basketSale.deleteMany({
      where: {
        groupCode: group,
      },
    });

    // Return the created sale
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
