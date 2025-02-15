import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";


// GET: Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { Products: true },
    });
    return NextResponse.json(categories, { status: 200 });
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

// POST: Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
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
